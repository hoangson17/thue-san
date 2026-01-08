import axiosIntance from "@/axiosConfig";

export const tournamentService = {
  getTournament: async (page: number, limit: number, order?: string, search?: string) => {
    const res = await axiosIntance.get("/tournaments", {
      params: { page, limit, order, search },
    });
    return res;
  },

  getTournamentById: async (id: number) => {
    const res = await axiosIntance.get(`/tournaments/${id}`);
    return res.data;
  },

  tournamentRegister: async (tournamentId: number) => {
    const res = await axiosIntance.post(
      `/tournaments-register/${tournamentId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return res.data;
  },
};
