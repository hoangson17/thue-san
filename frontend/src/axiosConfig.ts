import axios from "axios";
import { logout } from "./stores/actions/authActions";
import reduxStore from "./redux";
import { socketClient } from "./utils/socket";

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Biến để quản lý việc refresh token đang diễn ra
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  isRefreshing = false;
  failedQueue = [];
};

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
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_API}/auth/refresh-token`,
          { refreshToken },
          {
            timeout: 5000,
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = res.data;

        localStorage.setItem("accessToken", accessToken);
        
        // Nếu server trả về refresh token mới, cập nhật nó
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Đồng bộ lại kết nối realtime với token mới
        try {
          socketClient.disconnect();
          socketClient.connect();
        } catch (socketErr) {
          console.error("Socket reconnect error:", socketErr);
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        processQueue(null, accessToken);
        
        return instance(originalRequest);
      } catch (err: any) {
        console.error("Refresh token failed:", err.message);
        
        // Refresh token chết → logout
        try {
          socketClient.disconnect();
        } catch (socketErr) {
          console.error("Socket disconnect error:", socketErr);
        }
        
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        reduxStore().store.dispatch(logout());

        processQueue(err, null);

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
