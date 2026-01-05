import { clerkClient } from "@clerk/express";
import UsageMetric from "../models/UsageMetric.model.js";
import { PLAN_LIMITS } from "../config/planLimits.js";


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


export async function reconcileUsageMetric(req, res, next) {
  const { userId } = req.auth();
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const user = await clerkClient.users.getUser(userId);
  const planKey = user.publicMetadata?.planKey || "free_user";
  const planConfig = PLAN_LIMITS[planKey];

  const month = getCurrentMonth();
  let usage = await UsageMetric.findOne({ userId });

  if (!usage) {
    await UsageMetric.create({
      userId,
      month,
      plan: planConfig.plan,
      limit: planConfig.limit,
      queryCount: 0,
      resetAt: getNextResetDate(),
    });
    return next();
  }

  let changed = false;

  if (usage.month !== month) {
    usage.month = month;
    usage.queryCount = 0;
    usage.resetAt = getNextResetDate();
    changed = true;
  }

  if (usage.plan !== planConfig.plan) {
    usage.plan = planConfig.plan;
    usage.limit = planConfig.limit;
    changed = true;
  }

  if (changed) await usage.save();
  next();
}
