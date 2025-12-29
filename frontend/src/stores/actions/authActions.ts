import actionTypes from "./actionTypes";
import { authService } from "../../services/authService";
import { toast } from "sonner";

export const login =
  (email: string, password: string) => async (dispatch: any) => {
    dispatch({ type: actionTypes.LOGIN_REQUEST });
    try {
      const res = await authService.login(email, password);
      authService.saveTokens(res.data.accessToken, res.data.refreshToken);
      dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: res.data });
      toast.success("Đăng nhập thành công");
    } catch (err: any) {
      dispatch({
        type: actionTypes.LOGIN_FAILURE,
        payload: err.response?.data?.message || "Sai tài khoản hoặc mật khẩu",
      });
      toast.error(err.response?.data?.message || "Sai tài khoản hoặc mật khẩu");
    }
  };

export const register = (body: any) => async (dispatch: any) => {
  try {
    const res = await authService.register(body);

    dispatch({
      type: actionTypes.REGISTER_SUCCESS,
      payload: res.data,
    });
    toast.success("Đăng ký thành công");
    return res.data;
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";

    dispatch({
      type: actionTypes.REGISTER_FAIL,
      payload: errorMessage,
    });
    toast.error(err.response?.data?.message || "đăng ký thất bại");
    throw new Error(errorMessage);
  }
};

export const loginWithGoogle =
  (accessTokenFromGoogle: string) => async (dispatch: any) => {
    dispatch({ type: actionTypes.LOGIN_REQUEST });
    try {
      const res = await authService.loginWithGoogle(accessTokenFromGoogle);
      authService.saveTokens(res.data.accessToken, res.data.refreshToken);
      dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: res.data });
    } catch (err: any) {
      dispatch({
        type: actionTypes.LOGIN_FAILURE,
        payload: err.response?.data?.message || "Google login failed",
      });
    }
  };

export const logout = () => (dispatch: any) => {
  authService.logout();
  dispatch({ type: actionTypes.LOGOUT });
};

export const refreshAccessToken = (token: any) => ({
  type: actionTypes.REFRESH_TOKEN,
  payload: token,
});

export const setProfile = (data: any) => ({
  type: actionTypes.SET_PROFILE,
  payload: data,
});

export const getAllUsers = (page: number) => async (dispatch: any) => {
  dispatch({ type: actionTypes.GET_ALL_USERS_REQUEST });
  const limit = import.meta.env.VITE_PAGE_LIMIT;
  try {
    const response = await authService.getAllUsers(page);
    dispatch({
      type: actionTypes.GET_ALL_USERS_SUCCESS,
      payload: {
        data: response.data[0],
        pagination: {
          total: response.data[1],
          page,
          limit,
          totalPages: Math.ceil(response.data[1] / limit),
        },
      },
    });
  } catch (err: any) {
    dispatch({ type: actionTypes.GET_ALL_USERS_FAILURE, payload: err });
  }
};
