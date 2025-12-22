import mongoose from "mongoose";

const QueryLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  connectionId: { type: String, required: true },

  naturalLanguage: { type: String, required: true },
  generatedSQL: { type: String },

  status: {
    type: String,
    enum: ["SUCCESS", "BLOCKED", "ERROR"],
    required: true,
  },

  errorMessage: { type: String },
  executionTimeMs: { type: Number },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("QueryLog", QueryLogSchema);
