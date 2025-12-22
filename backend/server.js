import express from "express";
import cors from "cors";
import { ENV } from "./src/config/env.js";
import { connectDB } from "./src/config/appDb.js";

connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.listen(ENV.PORT, () => {
  console.log(`Backend running on port ${ENV.PORT}`);
});
