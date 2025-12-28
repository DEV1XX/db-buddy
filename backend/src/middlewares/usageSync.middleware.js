import UsageMetric from "../models/UsageMetric.model.js";
import { PLAN_LIMITS } from "../config/planLimits.js";
import { clerkClient, getAuth } from "@clerk/express";

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
}

function getNextResetDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function syncUsageMetric(req, res, next) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await clerkClient.users.getUser(userId);
    const planKey = user.publicMetadata?.planKey || "free_user";

    const planConfig = PLAN_LIMITS[planKey];
    if (!planConfig) {
      return res.status(400).json({ error: "Invalid subscription plan" });
    }

    const currentMonth = getCurrentMonth();

    let usage = await UsageMetric.findOne({ userId });

    // 1️⃣ First time user
    if (!usage) {
      await UsageMetric.create({
        userId,
        month: currentMonth,
        plan: planConfig.plan,
        queryCount: 0,
        limit: planConfig.limit,
        resetAt: getNextResetDate(),
      });
      return next();
    }

    // 2️⃣ Month changed → reset
    if (usage.month !== currentMonth) {
      usage.month = currentMonth;
      usage.queryCount = 0;
      usage.limit = planConfig.limit;
      usage.plan = planConfig.plan;
      usage.resetAt = getNextResetDate();
      await usage.save();
      return next();
    }

    // 3️⃣ Plan changed mid-month
    if (usage.plan !== planConfig.plan) {
      usage.plan = planConfig.plan;
      usage.limit = planConfig.limit;
      await usage.save();
    }

    // 4️⃣ Enforce limit BEFORE query execution
    if (usage.queryCount >= usage.limit) {
      return res.status(429).json({
        error: "Monthly query limit reached",
        plan: usage.plan,
        limit: usage.limit,
      });
    }

    // 5️⃣ Atomic increment (safe for parallel requests)
    await UsageMetric.updateOne(
      { _id: usage._id },
      { $inc: { queryCount: 1 } }
    );

    next();
  } catch (err) {
    console.error("Usage sync error:", err);
    return res.status(500).json({
      error: "Failed to sync usage metrics",
    });
  }
}
