import UsageMetric from "../models/UsageMetric.model.js";

export async function consumeUsageMetric(req, res, next) {
  const { userId } = req.auth();
  const usage = await UsageMetric.findOne({ userId });

  if (usage.queryCount >= usage.limit) {
    return res.status(429).json({
      error: "Monthly limit reached",
      plan: usage.plan,
      limit: usage.limit,
    });
  }

  await UsageMetric.updateOne(
    { _id: usage._id },
    { $inc: { queryCount: 1 } }
  );

  next();
}
