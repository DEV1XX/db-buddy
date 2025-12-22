import mongoose from "mongoose";

const UsageMetricSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  month: { type: String, required: true },

  plan: { type: String, required: true },
  queryCount: { type: Number, default: 0 },
  limit: { type: Number, required: true },

  resetAt: { type: Date, required: true },
});

export default mongoose.model("UsageMetric", UsageMetricSchema);
