import cron from "node-cron";
import { resetExpiredUsage } from "./resetUsage.cron.js";

export function startCronJobs() {
  cron.schedule("0 0 * * *", async () => {
    await resetExpiredUsage();
  });
}

//0 0 * * * - At midnight every day