import { axiosInstance } from "@/interceptors";
import type { ApiResponse } from "@/types";

export interface LoginResponseData {
  token?: string;
  accessToken?: string;
  user?: Record<string, unknown>;
}

export const login = async (email: string, password: string) => {
  const { data } = await axiosInstance.post<ApiResponse<LoginResponseData>>("/auth/login", { email, password });
  return data;
};

