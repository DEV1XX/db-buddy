import express from "express";
import cors from "cors";

import { ENV } from "./src/config/env.js";
import { connectDB } from "./src/config/appDb.js";

import { clerkMiddleware } from "@clerk/express";
import { startCronJobs } from "./src/cron/index.js";

// Routes
import databaseRoutes from "./src/routes/database.routes.js";
// import schemaRoutes from "./src/routes/schema.routes.js";
import queryRoutes from "./src/routes/query.routes.js";

// --------------------
// App bootstrap
// --------------------
connectDB();

const app = express();

// --------------------
// Global Middlewares
// --------------------
app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  credentials: true,
}));
app.use(express.json());
app.use(clerkMiddleware());

// --------------------
// Health check
// --------------------
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// --------------------
// Routes
// --------------------
app.use("/api/database", databaseRoutes);
// app.use("/api/schema", schemaRoutes);
app.use("/api/query", queryRoutes);

// --------------------
// Cron Jobs
// --------------------
startCronJobs();

// --------------------
// Server start
// --------------------
app.listen(ENV.PORT, () => {
  console.log(`✅ Backend running on port ${ENV.PORT}`);
});
