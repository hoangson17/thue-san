import axiosIntance from "@/axiosConfig";

export const tournamentService = {
    getTournament: async (page: number,limit: number) => {
        const res = await axiosIntance.get("/tournaments", { params: { page, limit } });        
        return res;
    },

    getTournamentById: async (id: number) => {
        const res = await axiosIntance.get(`/tournaments/${id}`);        
        return res.data;
    },
};
