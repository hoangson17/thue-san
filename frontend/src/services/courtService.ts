import axiosInstance from '@/axiosConfig';

export const courtService = {
    getCourt: async () => {
        const response = await axiosInstance.get('/court');        
        return response.data;
    },

    getCourtDetail: async (id: string) => {
        const response = await axiosInstance.get(`/court/${id}`);        
        return response.data;
    },

    createCourt: async (data: any) => {
        const response = await axiosInstance.post('/court', data, {
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
}