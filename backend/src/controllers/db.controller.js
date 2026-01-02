import { v4 as uuid } from "uuid";
import DatabaseConnection from "../models/DatabaseConnection.model.js";
import { encrypt } from "../services/encryption.service.js";

export async function registerDatabase(req, res) {
  try {
    const userId = req.auth.userId;
    const { dbType, host, port, database, username, password } = req.body;

    if (!dbType || !host || !database || !username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const encryptedPassword = encrypt(password);

    const record = await DatabaseConnection.create({
      connectionId: uuid(),
      userId,
      dbType,
      host,
      port,
      database,
      username,
      encryptedPassword,
    });

    res.status(201).json({
      message: "Database registered successfully",
      connectionId: record.connectionId,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to register database" });
  }
}


export async function deleteDatabase(req, res) {
  const { userId } = req.auth(); // or req.getAuth()
  const { connectionId } = req.params;

  if (!connectionId) {
    return res.status(400).json({
      success: false,
      message: "connectionId is required",
    });
  }

  try {
    const connection = await DatabaseConnection.findOne({
      connectionId,
      userId,
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Database connection not found or unauthorized",
      });
    }

    await Promise.all([
      DatabaseConnection.deleteOne({ connectionId, userId }),
      SchemaMetadata.deleteMany({ connectionId, userId }),
      QueryLog.deleteMany({ connectionId, userId }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Database connection deleted successfully",
    });
  } catch (error) {
    console.error("Delete database error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete database connection",
    });
  }
}


