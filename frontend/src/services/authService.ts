import axiosInstance from "../axiosConfig";

export const authService = {
  login: (email: string, password: string) =>
    axiosInstance.post("/auth/login", { email, password }),

  loginWithGoogle: (accessTokenFromGoogle: string) =>
    axiosInstance.post("/auth/google/callback", {
      accessToken: accessTokenFromGoogle,
    }),

  loginWithFacebook: (accessTokenFromFacebook: string) =>
    axiosInstance.post("/auth/facebook/callback", {
      accessToken: accessTokenFromFacebook,
    }),

  getProfile: () => axiosInstance.get("/auth/profile",{}),

  register: (body: any) => axiosInstance.post("/auth/register", body),

  logout: () => {
    axiosInstance.post("/auth/logout",{});
    delete axiosInstance.defaults.headers.common["Authorization"];
  },

  saveTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  },

  forgotPassword(email: string) {
    return axiosInstance.post("/auth/forgot-password", { email });
  },

  resetPassword(data: { email: string; otp: string; newPassword: string }) {
    return axiosInstance.post("/auth/reset-password", data);
  },

  updateProfile(formData: FormData) {
    return axiosInstance.patch("/auth/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateRole: (id: number, role: string) =>
    axiosInstance.patch(
      `/auth/role/${id}`,
      { role },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ),

  findAllUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    order?: "ASC" | "DESC";
  }) => {
    const res = await axiosInstance.get("/users/all", {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
        role: params.role,
        order: params.order,
      },
    });
    // console.log(res.data);

    return res.data;
  },

  findOneUser: async () => {
    const res = await axiosInstance.get("/users", {
      headers: {
      },
    });
    return res.data;
  },

  deleteUser: (id: number) =>
    axiosInstance.delete(`/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }),

  restoreUser: (id: number) =>
    axiosInstance.patch(
      `/users/restore/${id}`,
      {},
    ),

  lockUser: (id: number) =>
    axiosInstance.delete(`/users/lock/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }),

  getAllUsersLocked: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    order?: "ASC" | "DESC";
  }) =>
    axiosInstance.get(`/users/locked`, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
        role: params.role,
        order: params.order,
      },
    }),
};
