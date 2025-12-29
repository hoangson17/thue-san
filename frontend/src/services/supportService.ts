import axiosInstance from '@/axiosConfig';

export const supportService = {
    getSupport: async () => {
        const response = await axiosInstance.get("/support");
        return response.data;
    },

    getSupportById: async (id: number) => {
        const response = await axiosInstance.get(`/support/${id}`);
        return response.data;
    },

    createSupport: async (support: any) => {
        const response = await axiosInstance.post("/support", support);
        return response.data;
    },
}