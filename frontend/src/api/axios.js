// src/api/axios.js

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =======================
   REQUEST INTERCEPTOR
   ======================= */
api.interceptors.request.use(
  (config) => {
    // Example: attach token if you use JWT later
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =======================
   RESPONSE INTERCEPTOR
   ======================= */
api.interceptors.response.use(
  (response) => {
    // Always return clean data
    return response.data;
  },
  (error) => {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong";

    console.error("API ERROR:", message);

    return Promise.reject(error);
  }
);

export default api;
