import axios, { AxiosResponse } from "axios";
import type { Product } from "../entities/product/model/product";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://cats-market-api.onrender.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export interface SignInResponse {
  user: {
    id: number;
    username: string;
    full_name: string;
  };
}

export interface User {
  id: number;
  username: string;
  full_name: string;
}

export const signUp = async (
  username: string,
  fullName: string,
  password: string
): Promise<AxiosResponse<User>> => {
  const response = await api.post<User>("/api/sign_up", {
    username,
    full_name: fullName,
    password,
  });

  return response;
};

export const signIn = async (
  username: string,
  password: string
): Promise<SignInResponse> => {
  const response = await api.post<SignInResponse>("/api/sign_in", {
    username,
    password,
  });

  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>("/api/me");
  return response.data;
};

type ProductsResponse = { products: Product[]; pages: number };

export const fetchProducts = async (
  page: number
): Promise<{ data: ProductsResponse }> => {
  try {
    const response = await api.get<ProductsResponse>("/api/products", {
      params: { page, limit: 5 },
    });

    return { data: response.data };
  } catch (error) {
    console.error("Ошибка при загрузке товаров:", error);
    return { data: { products: [], pages: 1 } };
  }
};
