const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const API_ENDPOINTS = {
  // 🔐 Auth (handled by Clerk on frontend)
  
  // 🔌 Database connections
  CONNECT_DATABASE: `${API_BASE_URL}/database/connect`,
  GET_DATABASES: `${API_BASE_URL}/database`,
  DELETE_DATABASE: (connectionId) =>
    `${API_BASE_URL}/database/${connectionId}`,

  // 🧬 Schema
  EXTRACT_SCHEMA: (connectionId) =>
    `${API_BASE_URL}/schema/extract/${connectionId}`,
  GET_SCHEMA: (connectionId) =>
    `${API_BASE_URL}/schema/${connectionId}`,

  // 💬 Core Query
  ASK_QUERY: `${API_BASE_URL}/query`,

  // 📜 Logs
  QUERY_HISTORY: `${API_BASE_URL}/queries/history`,
  QUERY_HISTORY_BY_DB: (connectionId) =>
    `${API_BASE_URL}/queries/history/${connectionId}`,

  // 📊 Usage & Plan
  USAGE_METRICS: `${API_BASE_URL}/usage`,

  // ⚙️ Health / Debug
  HEALTH_CHECK: `${API_BASE_URL}/health`,
};
