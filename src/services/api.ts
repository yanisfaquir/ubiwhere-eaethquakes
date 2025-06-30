import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: "https://recruitment.ubiwhere.com/api",
});

// Interceptor para renovar token automaticamente (exemplo base)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      const response = await axios.post("https://recruitment.ubiwhere.com/api/refresh", {
        refresh_token: refreshToken,
      });

      const newAccessToken = response.data.access_token;
      localStorage.setItem("access_token", newAccessToken);
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

// Adiciona token ao header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
