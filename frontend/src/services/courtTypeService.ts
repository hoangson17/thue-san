import AxiosInstance from "@/axiosConfig";

const courtTypeService = {
  getAll: async () => {
    const response = await AxiosInstance.get("/court-type");    
    return response;
  },

  create: async (data: any) => {
    const response = await AxiosInstance.post("/court-type", data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await AxiosInstance.patch(`/court-type/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await AxiosInstance.delete(`/court-type/${id}`);
    return response.data;
  },
};

export default courtTypeService;
