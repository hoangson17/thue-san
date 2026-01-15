import axiosInstance from "@/axiosConfig";

export const priceService = {
  getPrices: async (
    page?: number,
    limit?: number,
    search?: string,
    order?: string
  ) => {
    const params: any = {};
    if (page !== undefined && limit !== undefined) {
      params.page = page;
      params.limit = limit;
    }
    if (search) {
      params.search = search;
    }
    if (order) {
      params.order = order;
    }
    return axiosInstance.get("/prices", { params });
  },

  getPriceDetail: async (id: string) => {
    const response = await axiosInstance.get(`/prices/${id}`);
    return response.data;
  },

  createPrice: async (data: any) => {
    const response = await axiosInstance.post("/prices", data);
    return response.data;
  },

  updatePrice: async (id: string, data: any) => {
    const response = await axiosInstance.patch(`/prices/${id}`, data);
    return response.data;
  },

  softDeletePrice: async (id: number) => {
    const response = await axiosInstance.delete(
      `/prices/${id}/softdelete`
    );
    return response.data;
  },

  restorePrice: async (id: number) => {
    const response = await axiosInstance.patch(`/prices/${id}/restore`);
    return response.data;
  },

  deletePrice: async (id: number) => {
    const response = await axiosInstance.delete(`/prices/${id}`);
    return response.data;
  },
};
