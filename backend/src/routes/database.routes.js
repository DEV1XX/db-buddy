import express from "express";
import { requireAuth } from "@clerk/express";
import { registerDatabase } from "../controllers/db.controller.js";
import { extractSchema } from "../controllers/schema.controller.js";

const router = express.Router();

router.post("/", requireAuth(), registerDatabase);
router.post("/:connectionId/schema", requireAuth(), extractSchema);

export default router;
