import axios from "axios";

const BASE_URL = "http://localhost:8080/api/";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor to add token before sending request
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user")); // Get stored user
    if (user && user.jwtToken) {
      config.headers.Authorization = `Bearer ${user.jwtToken}`; // Attach token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
