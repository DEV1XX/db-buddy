import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import { PLAN_LIMITS } from "../config/planLimits.js";
import { clerkClient } from "@clerk/express";

/* =========================
   GET PRICING PLANS
   ========================= */
export const getPricingPlans = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Pricing plans fetched successfully",
      plans: PLAN_LIMITS,
    });
  } catch (error) {
    console.error("Get pricing plans error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pricing plans",
    });
  }
};

/* =========================
   CREATE ORDER
   ========================= */
export const createOrder = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { planKey } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!planKey) {
      return res.status(400).json({ error: "Plan key is required" });
    }

    const plan = PLAN_LIMITS[planKey];

    if (!plan || typeof plan.price !== "number" || plan.price <= 0) {
      return res.status(400).json({ error: "Invalid paid plan" });
    }

    const order = await razorpay.orders.create({
      amount: Number(plan.price) * 100, // Razorpay expects paise
      currency: "INR",
      receipt: `dbb_${Date.now()}`,
      notes: {
        userId,
        planKey,
      },
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Create order error:", error?.error || error);

    return res.status(500).json({
      error: "Failed to create Razorpay order",
      details: error?.error?.description || "Internal server error",
    });
  }
};

/* =========================
   VERIFY PAYMENT
   ========================= */
export const verifyPayment = async (req, res) => {
  try {
    const { userId } = req.auth();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planKey,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !planKey
    ) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    const plan = PLAN_LIMITS[planKey];
    if (!plan) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    /* 🔥 Update user plan in Clerk */
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        planKey: planKey,
        subscriptionPlan: planKey,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and plan upgraded",
      plan: plan.plan,
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return res.status(500).json({
      error: "Payment verification failed",
    });
  }
};
