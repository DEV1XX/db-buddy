// SCHEMA EXTRACTION AND STORAGE
import DatabaseConnection from "../models/DatabaseConnection.model.js";
import SchemaMetadata from "../models/SchemaMetadata.model.js";
import { decrypt } from "../services/encryption.service.js";
import { createDbClient } from "../services/dbClient.service.js";
import { formatSchema, compressSchema } from "../services/formatSchema.service.js";

export async function extractSchema(req, res) {
  try {
    const { userId } = req.auth();
    const { connectionId } = req.params;

    const connection = await DatabaseConnection.findOne({
      connectionId,
      userId,
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Connection not found",
      });
    }

    const decryptedPassword = decrypt(connection.encryptedPassword);

    const connObj = connection.toObject();
    delete connObj.encryptedPassword;

    const dbClient = await createDbClient({
      ...connObj,
      decryptedPassword,
    });

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

    const formattedTables = await formatSchema(tables);
    const compressedTables = compressSchema(formattedTables);

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

    return res.status(200).json({
      success: true,
      message: "Schema extracted successfully",
      formattedSchema: formattedTables,
      compressedSchema: compressedTables,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Schema extraction failed",
    });
  }
}
