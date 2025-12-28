//SCHEMA EXTRACTION AND STORAGE
import DatabaseConnection from "../models/DatabaseConnection.model.js";
import SchemaMetadata from "../models/SchemaMetadata.model.js";
import { decrypt } from "../services/encryption.service.js";
import { createDbClient } from "../services/dbClient.service.js";
import { getAuth } from "@clerk/express";

export async function extractSchema(req, res) {
  try {
    const { userId } = getAuth(req);
    const { connectionId } = req.params;

    const connection = await DatabaseConnection.findOne({ userId, connectionId });
    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    const decryptedPassword = decrypt(connection.encryptedPassword);
    const dbClient = await createDbClient({ ...connection.toObject(), decryptedPassword });

    let tables = [];

    if (connection.dbType === "mysql") {
      const [rows] = await dbClient.execute(`
        SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = '${connection.database}'
      `);

      tables = rows;
      await dbClient.end();
    }

    if (connection.dbType === "postgres") {
      const result = await dbClient.query(`
        SELECT table_name, column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
      `);
      tables = result.rows;
      await dbClient.end();
    }

    await SchemaMetadata.findOneAndUpdate(
      { connectionId },
      {
        userId,
        connectionId,
        schema: tables,
        updatedAt: new Date(),
      },
      { upsert: true }
    );

    res.json({ message: "Schema extracted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Schema extraction failed" });
  }
}
