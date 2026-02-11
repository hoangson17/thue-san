import axios from "axios";
import { logout } from "./stores/actions/authActions";
import reduxStore from "./redux";
import { socketClient } from "./utils/socket";

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_API}/auth/refresh-token`,
          { refreshToken },
        );

        const { accessToken } = res.data;

        localStorage.setItem("accessToken", accessToken);
        // Đồng bộ lại kết nối realtime với token mới
        socketClient.disconnect();
        socketClient.connect();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (err) {
        // refresh token chết → logout
        socketClient.disconnect();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        reduxStore().store.dispatch(logout());

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
