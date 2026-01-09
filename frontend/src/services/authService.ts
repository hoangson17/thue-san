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

  register: (body: any) => axiosInstance.post("/auth/register", body),

  logout: () => {
    axiosInstance.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    localStorage.removeItem("persist:auth");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
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
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  },
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
    console.log(res.data);

    return res.data;
  },

  findOneUser: async () => {
    const res = await axiosInstance.get("/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return res.data;
  },

  deleteUser: (id: number) =>
    axiosInstance.delete(`/user/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }),

  restoreUser: (id: number) =>
    axiosInstance.patch(
      `/user/restore/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    ),

  getUserLock: () =>
    axiosInstance.get("/user/lock", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }),

  hardDeleteUser: (id: number) =>
    axiosInstance.delete(`/user/hard-delete/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }),
};
