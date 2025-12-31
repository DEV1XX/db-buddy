import DatabaseConnection from "../models/DatabaseConnection.model.js";
import SchemaMetadata from "../models/SchemaMetadata.model.js";
import UsageMetric from "../models/UsageMetric.model.js";
import QueryLog from "../models/QueryLog.model.js";

/* =========================
   GET USER CONNECTIONS
   ========================= */
export const getUserConnections = async (req, res) => {
  const { userId } = req.auth();

  try {
    const connections = await DatabaseConnection.find({ userId });
    res.status(200).json({
      success: true,
      connections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user connections",
    });
  }
};

/* =========================
   GET ALL QUERY LOGS
   ========================= */
export const getUserQueryLogs = async (req, res) => {
  const { userId } = req.auth();

  try {
    const queryLogs = await QueryLog.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      queryLogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching query logs",
    });
  }
};

/* =========================
   GET QUERY LOGS BY DATABASE
   ========================= */
export const getUserQueryLogsByDatabase = async (req, res) => {
  const { userId } = req.auth();
  const { connectionId } = req.params;

  try {
    const logs = await QueryLog.find({
      userId,
      connectionId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching database query logs",
    });
  }
};

/* =========================
   GET USAGE METRICS
   ========================= */
export const getUserUsageMetrics = async (req, res) => {
  const { userId } = req.auth();

  try {
    const usage = await UsageMetric.findOne({ userId });

    res.status(200).json({
      success: true,
      usage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching usage metrics",
    });
  }
};
