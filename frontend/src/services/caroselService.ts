import axiosInstance from "@/axiosConfig";

export const caroselService = {
    getCarosel: async () => {
        const response = await axiosInstance.get("/carosels");
        return response.data;
    },

    getCaroselDetail: async (id: string) => {
        const response = await axiosInstance.get(`/carosels/${id}`);
        return response.data;
    },

    createCarosel: async (data: any) => {
        const response = await axiosInstance.post("/carosels", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    updateCarosel: async (id: string, data: any) => {
        const response = await axiosInstance.patch(`/carosels/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    deleteCarosel: async (id: number) => {
        const response = await axiosInstance.delete(`/carosels/${id}`);
        return response.data;
    },
};