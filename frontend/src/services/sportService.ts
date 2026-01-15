import AxiosInstance from "@/axiosConfig";

export const sportService = {
    getSports: async () => {
        const response = await AxiosInstance.get("/sport");
        return response.data;
    },

    createSport: async (data: any) => {
        const response = await AxiosInstance.post("/sport", data);
        return response.data;
    },

    updateSport: async (id: number, data: any) => {
        const response = await AxiosInstance.patch(`/sport/${id}`, data);
        return response.data;
    },

    deleteSport: async (id: number) => {
        const response = await AxiosInstance.delete(`/sport/${id}`);
        return response.data;
    },
};

export default sportService;
