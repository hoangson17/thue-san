import axiosInstance from "@/axiosConfig";
import { removeItem } from "framer-motion";

export const cartService = {
  getCart: async () => {
    const response = await axiosInstance.get(`/cart`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  },

  addToCart: async (data: any) => {
    const response = await axiosInstance.post(`/cart`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  },

  removeItem: async (id: string) => {
    const response = await axiosInstance.delete(`/cart/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  },
};
