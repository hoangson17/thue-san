import axiosInstance from "@/axiosConfig";

export const productService = {
  getProducts: async () => {
    const response = await axiosInstance.get("/products");
    return response.data;
  },

  getProductDetail: async (id: string) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  getProductsByCategory: async (category: string) => {
    const response = await axiosInstance.get("/products", {
      params: {
        category,
        t: Date.now(),  // chống cache
      },
    });
    return response.data;
  },
};
