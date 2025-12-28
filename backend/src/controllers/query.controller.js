import { getAuth } from "@clerk/express";
import DatabaseConnection from "../models/DatabaseConnection.model.js";
import SchemaMetadata from "../models/SchemaMetadata.model.js";
import UsageMetric from "../models/UsageMetric.model.js";
import QueryLog from "../models/QueryLog.model.js";
import { decrypt } from "../services/encryption.service.js";
import { createDbClient } from "../services/dbClient.service.js";
import { nlToSql } from "../services/openai.service.js";
import { isReadOnlyQuery } from "../services/sqlGuard.service.js";

export async function handleQuery(req, res) {
  const startTime = Date.now();
  let generatedSQL = "";

  try {
    const { userId } = getAuth(req);
    const { connectionId, question } = req.body;

    if (!question || !connectionId) {
      return res.status(400).json({ error: "Missing query or connectionId" });
    }

    // 1️⃣ Fetch usage metrics (current month assumed pre-created)
    const usage = await UsageMetric.findOne({ userId });

    if (!usage) {
      return res.status(403).json({ error: "Usage plan not initialized" });
    }

    if (usage.queryCount >= usage.limit) {
      await QueryLog.create({
        userId,
        connectionId,
        naturalLanguage: question,
        generatedSQL: null,
        status: "BLOCKED",
        errorMessage: "Query limit exceeded",
      });

      return res.status(403).json({ error: "Query limit exceeded" });
    }

    // 2️⃣ Fetch DB connection + schema
    const connection = await DatabaseConnection.findOne({ userId, connectionId });
    const schemaDoc = await SchemaMetadata.findOne({ userId, connectionId });

    if (!connection || !schemaDoc) {
      return res.status(404).json({ error: "Database or schema not found" });
    }

    // 3️⃣ NL → SQL
    generatedSQL = await nlToSql({
      question,
      schema: JSON.stringify(schemaDoc.schema),
      dbType: connection.dbType,
    });

    if (!isReadOnlyQuery(generatedSQL)) {
      await QueryLog.create({
        userId,
        connectionId,
        naturalLanguage: question,
        generatedSQL,
        status: "BLOCKED",
        errorMessage: "Non read-only query detected",
      });

      return res.status(400).json({ error: "Only read-only queries are allowed" });
    }

    // 4️⃣ Execute query
    const decryptedPassword = decrypt(connection.encryptedPassword);
    const dbClient = await createDbClient({
      ...connection.toObject(),
      decryptedPassword,
    });

    let results;

    if (connection.dbType === "mysql") {
      const [rows] = await dbClient.execute(generatedSQL);
      results = rows;
      await dbClient.end();
    }

    if (connection.dbType === "postgres") {
      const queryRes = await dbClient.query(generatedSQL);
      results = queryRes.rows;
      await dbClient.end();
    }

    const executionTimeMs = Date.now() - startTime;

    // 5️⃣ Log success
    await QueryLog.create({
      userId,
      connectionId,
      naturalLanguage: question,
      generatedSQL,
      status: "SUCCESS",
      executionTimeMs,
    });

    // 6️⃣ Increment usage
    await UsageMetric.updateOne(
      { userId },
      { $inc: { queryCount: 1 } }
    );

    return res.json({
      sql: generatedSQL,
      results,
      explanation: "Query executed successfully",
    });

  } catch (err) {
    await QueryLog.create({
      userId: req?.auth?.userId,
      connectionId: req.body?.connectionId,
      naturalLanguage: req.body?.question,
      generatedSQL,
      status: "ERROR",
      errorMessage: err.message,
    });

    return res.status(500).json({ error: "Query execution failed" });
  }
}
