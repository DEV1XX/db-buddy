//Creates temporary per-request DB connections
import mysql from "mysql2/promise";
import pkg from "pg";
const { Client } = pkg;

export async function createDbClient(connection) {
  if (connection.dbType === "mysql") {
    return await mysql.createConnection({
      host: connection.host,
      port: connection.port || 3306,
      user: connection.username,
      password: connection.decryptedPassword,
      database: connection.database,
    });
  }

  if (connection.dbType === "postgres") {
    const client = new Client({
      host: connection.host,
      port: connection.port || 5432,
      user: connection.username,
      password: connection.decryptedPassword,
      database: connection.database,
    });
    await client.connect();
    return client;
  }

  throw new Error("Unsupported database type");
}
