import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 60000,
});

let unauthorizedHandler;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export function getErrorMessage(error, fallback) {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.response?.status === 429) {
    return "Too many requests. Please wait a minute and try again.";
  }
  if (error.code === "ECONNABORTED" || !error.response) {
    return "The server is waking up or unreachable. Please try again in a moment.";
  }
  return fallback;
}

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config || {};
    const url = config.url || "";
    const isAuthEndpoint =
      url === "/auth/login" ||
      url === "/auth/register" ||
      url.endsWith("/auth/login") ||
      url.endsWith("/auth/register");
    if (error.response?.status === 401 && !isAuthEndpoint && unauthorizedHandler) {
      unauthorizedHandler();
    }
    return Promise.reject(error);
  },
);

export default client;
