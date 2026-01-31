import axios, { type AxiosError } from "axios";
import { API_URL } from "@/config";
import type { ApiResponse } from "@/types";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("TOKEN_AUTH");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("TOKEN_AUTH");
    }

    const message =
      error.response?.data?.description ||
      error.response?.data?.message ||
      error.message ||
      "Error de conexión con el servidor";

    return Promise.reject(new Error(message));
  }
);
