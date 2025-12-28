import UsageMetric from "../models/UsageMetric.model.js";

export async function resetExpiredUsage() {
  const now = new Date();

  await UsageMetric.updateMany(
    { resetAt: { $lte: now } },
    [
      {
        $set: {
          queryCount: 0,
          month: {
            $concat: [
              { $toString: { $year: now } },
              "-",
              { $toString: { $month: now } },
            ],
          },
          resetAt: new Date(now.setMonth(now.getMonth() + 1)),
        },
      },
    ]
  );
}
