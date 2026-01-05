import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getPricingPlans,
  createOrder,
  verifyPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

/* PUBLIC */
router.get("/pricing-plans", getPricingPlans);

/* PROTECTED */
router.post("/create-order", requireAuth(), createOrder);
router.post("/verify", requireAuth(), verifyPayment);

export default router;
