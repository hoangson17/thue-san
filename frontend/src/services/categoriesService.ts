import axiosInstance from "@/axiosConfig";

export const categoriesService = {
  getCategories: async (params?: {
    page?: number;
    limit?: number;
    order?: string;
    search?: string;
  }) => {
    const response = await axiosInstance.get("/categories", { params });
    return response.data;
  },
  
  getCategory: async (id: number) => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: any) => {
    const response = await axiosInstance.post("/categories", data);
    return response.data;
  },

  updateCategory: async (id: number, data: any) => {
    const response = await axiosInstance.patch(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  },

  restoreCategory: async (id: number) => {
    const response = await axiosInstance.patch(`/categories/${id}/restore`);
    return response.data;
  },

  softDeleteCategory: async (id: number) => {
    const response = await axiosInstance.delete(`/categories/${id}/softDelete`);
    return response.data;
  },
};

export default categoriesService;
