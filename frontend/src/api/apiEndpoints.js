const API_ENDPOINTS = {
  // Health
  HEALTH: "/health",

  // Database
  DATABASE: {
    REGISTER: "/api/database", // POST
    EXTRACT_SCHEMA: (connectionId) =>
      `/api/database/${connectionId}/schema`, // POST
  },
  
  // Queries-
  QUERY: {
    EXECUTE: "/api/query/execute-query", // POST
  },
};

export default API_ENDPOINTS;
