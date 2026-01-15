import { authService } from "@/services/authService";
import actionTypes from "./actionTypes";

export const getAllUsersLocked =
  (params?: {
    page?: number;
    search?: string;
    role?: string;
    order?: "ASC" | "DESC";
  }) =>
  async (dispatch: any) => {
    dispatch({ type: actionTypes.GET_USER_LOCKED_REQUEST });
    const limit = Number(import.meta.env.VITE_PAGE_LIMIT) || 8;
    try {
      const response = await authService.getAllUsersLocked({
        page: params?.page,
        limit,
        search: params?.search,
        role: params?.role,
        order: params?.order ?? "DESC",
      });      
      dispatch({
        type: actionTypes.GET_USER_LOCKED_SUCCESS,
        payload: {
          data: response.data,
           pagination: {
            total: response.data[1],
            page : params?.page,
            limit,
            totalPages: Math.ceil(response.data[1] / limit),
          },
        },
      });
    } catch (err: any) {
      dispatch({
        type: actionTypes.GET_ALL_USERS_FAILURE,
        payload: err?.response?.data || err,
      });
    }
  };