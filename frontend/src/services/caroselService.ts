import axiosInstance from "@/axiosConfig";

export const caroselService = {
    getCarosel: async () => {
        const response = await axiosInstance.get("/carosels");
        return response.data;
    },

    getCaroselDetail: async (id: string) => {
        const response = await axiosInstance.get(`/carosel/${id}`);
        return response.data;
    },

    createCarosel: async (data: any) => {
        const response = await axiosInstance.post("/carosel", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    updateCarosel: async (id: string, data: any) => {
        const response = await axiosInstance.put(`/carosel/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};