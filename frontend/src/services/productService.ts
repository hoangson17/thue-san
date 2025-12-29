import axiosInstance from "@/axiosConfig";

export const productService = {
  getProducts: async (
    page: number = 1,
    limit: number = 10,
    category?: string
  ) => {
    const params: any = { page, limit };

    if (category) {
      params.category = category;
    }

    return axiosInstance.get("/products", { params });
  },

  getProductDetail: async (id: string) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  getProductsByCategory: async (category: string) => {
    const response = await axiosInstance.get("/products", {
      params: {
        category,
        t: Date.now(), // chống cache
      },
    });
    return response.data;
  },
};
