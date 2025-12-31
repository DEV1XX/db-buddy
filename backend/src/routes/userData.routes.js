import express from "express";
import { requireAuth } from "@clerk/express";

import {
  getUserConnections,
  getUserQueryLogs,
  getUserQueryLogsByDatabase,
  getUserUsageMetrics,
} from "../controllers/user.controller.js";

const router = express.Router();

/* =========================
   USER ROUTES (PROTECTED)
   ========================= */

router.get("/connections", requireAuth(), getUserConnections);

router.get("/query-logs", requireAuth(), getUserQueryLogs);

router.get(
  "/query-logs/:connectionId",
  requireAuth(),
  getUserQueryLogsByDatabase
);

router.get("/usage-metrics", requireAuth(), getUserUsageMetrics);

export default router;
