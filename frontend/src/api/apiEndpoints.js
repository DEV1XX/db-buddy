const API_ENDPOINTS = {
  // Health
  HEALTH: "/health",

  // Database
  DATABASE: {
    REGISTER: "/api/database", // POST
    EXTRACT_SCHEMA: (connectionId) =>
      `/api/database/${connectionId}/schema`, // POST
    DELETE: (connectionId) => `/api/database/delete/${connectionId}`, // DELETE
  },
  
  // Queries-
  QUERY: {
    EXECUTE: "/api/query/execute-query", // POST
  },

  USER: {
    CONNECTIONS: "/api/user/connections", // GET
    QUERY_LOGS: "/api/user/query-logs", // GET
    QUERY_LOGS_BY_DB: (connectionId) =>
      `/api/user/query-logs/${connectionId}`, // GET
    USAGE_METRICS: "/api/user/usage-metrics", // GET
  },
  PAYMENT:{
    PRICING_PLANS: "/api/payments/pricing-plans", //GET
    CREATE_ORDER:"/api/payments/create-order",
    VERIFY:"/api/payments/verify"
  }
};

export default API_ENDPOINTS;
