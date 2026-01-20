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

  createTournament: async (data: any) => {
    const res = await axiosIntance.post("/tournaments", data,{
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return res.data;
  },

  updateTournament: async (id: number, data: any) => {
    const res = await axiosIntance.patch(`/tournaments/${id}`, data,{
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return res.data;
  },

  deleteTournament: async (id: number) => {
    const res = await axiosIntance.delete(`/tournaments/${id}`);
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
