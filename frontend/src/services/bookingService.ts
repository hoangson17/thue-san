import AxiosInstance from "@/axiosConfig"; 

export const bookingService = {
    async findAll() {
        const response = await AxiosInstance.get("/booking",{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return response.data;
    },

    async findAllAdmin(page?: number, limit?: number, order?: string, search?: string) {
        const response = await AxiosInstance.get(`/booking/admin`,{
            params: {
                page,
                limit,
                order,
                search
            },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return response.data;
    },

    async findAllByUser() {
        const response = await AxiosInstance.get(`/booking/user`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return response.data;
    },

    async create(data: any) {
        const response = await AxiosInstance.post("/booking", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return response.data;
    },
}