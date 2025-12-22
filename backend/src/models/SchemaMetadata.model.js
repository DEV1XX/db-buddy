import mongoose from "mongoose";

const SchemaMetadataSchema = new mongoose.Schema({
  connectionId: { type: String, required: true },
  userId: { type: String, required: true },

  schema: {
    type: mongoose.Schema.Types.Mixed, // 🔥 dynamic tables
    required: true,
  },

  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model(
  "SchemaMetadata",
  SchemaMetadataSchema
);
