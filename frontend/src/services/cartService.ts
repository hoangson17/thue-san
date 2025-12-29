import axiosInstance from "@/axiosConfig";

export const cartService = {
  getCart: async () => {
    const response = await axiosInstance.get(`/cart`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response;
  },
};
