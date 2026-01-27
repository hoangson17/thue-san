import axios from "axios";
import reduxStore from "./redux";
import { refreshAccessToken, logout } from "./stores/actions/authActions";

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 1. Request Interceptor: Gộp lại để xử lý token đồng nhất
instance.interceptors.request.use(
  (config) => {
    const state = reduxStore().store.getState();
    // Ưu tiên lấy từ Redux, fallback sang LocalStorage khi F5 trang
    const token = state.auth?.accessToken || localStorage.getItem("accessToken");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Xử lý lỗi 401
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và đây không phải là request gọi refresh-token (để tránh lặp vô tận)
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const state = reduxStore().store.getState();
        const refreshToken = state.auth?.refreshToken || localStorage.getItem("refreshToken");

        if (!refreshToken) throw new Error("No refresh token");

        // Gọi refresh token (Dùng axios gốc thay vì instance để tránh interceptor chặn lại)
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_API}/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken } = res.data;

        // Lưu token mới vào cả 2 nơi cho bền vững
        localStorage.setItem("accessToken", accessToken);
        reduxStore().store.dispatch(refreshAccessToken(accessToken));

        // Gán token mới vào header và thực hiện lại request lỗi ban đầu
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return instance(originalRequest);

      } catch (err) {
        // Nếu refresh thất bại (refresh token cũng hết hạn) -> Đăng xuất
        reduxStore().store.dispatch(logout());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;