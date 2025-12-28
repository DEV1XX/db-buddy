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
