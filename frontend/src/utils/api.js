import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local user data
      localStorage.removeItem("user");

      const isAuthCheck = error.config?.url?.includes("/auth/me");
      const isLoginRequest = error.config?.url?.includes("/auth/login");

      // Only redirect to login if not already on /login and not doing auth check or login
      if (!isAuthCheck && !isLoginRequest && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
