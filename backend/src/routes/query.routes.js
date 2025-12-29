import express from "express";
import { requireAuth } from "@clerk/express";
import { handleQuery } from "../controllers/query.controller.js";
import { syncUsageMetric } from "../middlewares/usageSync.middleware.js";

const router = express.Router();
router.post("/execute-query", requireAuth(), syncUsageMetric, handleQuery);

export default router;
