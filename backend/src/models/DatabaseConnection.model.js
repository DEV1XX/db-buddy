import mongoose from "mongoose";

const DatabaseConnectionSchema = new mongoose.Schema({
  connectionId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },

  dbType: {
    type: String,
    enum: ["postgres", "mysql"],
    required: true,
  },

  host: { type: String, required: true },
  port: { type: Number },
  database: { type: String, required: true },
  username: { type: String, required: true },
  encryptedPassword: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model(
  "DatabaseConnection",
  DatabaseConnectionSchema
);
