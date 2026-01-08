import axiosInstance from "@/axiosConfig";

export const supportService = {
  getSupport: async (page?: number, limit?: number, order?: string) => {
    const response = await axiosInstance.get("/support", {
      params: {
        page,
        limit,
        order,
      },
    });
    return response;
  },

  getSupportById: async (id: number) => {
    const response = await axiosInstance.get(`/support/${id}`);
    return response.data;
  },

  createSupport: async (support: any) => {
    const response = await axiosInstance.post("/support", support);
    return response.data;
  },

  updateSupport: async (id: number, support: any) => {
    const response = await axiosInstance.patch(`/support/${id}`, support);
    return response.data;
  },

  deleteSupport: async (id: number) => {
    const response = await axiosInstance.delete(`/support/${id}`);
    return response.data;
  },
};
