import axiosInstance from "@/axiosConfig";

export const courtService = {
  getCourt: async (page?: number, limit?: number, order?: string, search?: string) => {
    const response = await axiosInstance.get("/court", {
      params: {
        page,
        limit,
        order,
        search,
      },
    });
    return response;
  },

  getCourtDetail: async (id: string) => {
    const response = await axiosInstance.get(`/court/${id}`);
    return response.data;
  },

  createCourt: async (data: any) => {
    const response = await axiosInstance.post("/court", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateCourt: async (id: string, data: any) => {
    const response = await axiosInstance.patch(`/court/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteCourt: async (id: string) => {
    const response = await axiosInstance.delete(`/court/${id}`);
    return response.data;
  },
};
