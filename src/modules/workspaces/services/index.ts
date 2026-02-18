import { axiosInstance } from "../../../interceptors";
import type { ApiResponse } from "@/types";

export interface Workspace {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  members: number;
}

export const getWorkspaces = async (): Promise<ApiResponse<Workspace[]>> => {
  const { data } = await axiosInstance.get<ApiResponse<Workspace[]>>("/workspaces");
  return data;
};

export const createWorkspace = async (name: string): Promise<ApiResponse<string>> => {
  const { data } = await axiosInstance.post<ApiResponse<string>>("/workspaces", { name });
  return data;
};
