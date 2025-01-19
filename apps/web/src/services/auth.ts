import api from "../lib/api";
import type { ApiResponse, AuthResponse, User } from "../types/api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface GetUserResponse {
  data: {
    data: User;
  };
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    data
  );
  return response.data.data;
};

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get<GetUserResponse>("/auth/me");
    return response.data.data.data;
  } catch (error) {
    return null;
  }
}

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/admin/login";
};
