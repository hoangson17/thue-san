import axiosIstance from "@/axiosConfig";
import actionTypes from "./actionTypes";
import { supportService } from "@/services/supportService";

export const getSupport =
  (page?: number, order?: string) => async (dispatch: any) => {
    dispatch({ type: actionTypes.GET_SUPPORT_REQUEST });
    const limit = import.meta.env.VITE_PAGE_LIMIT;
    try {
      const response = await supportService.getSupport(page, limit, order);
      // console.log(response);
      
      dispatch({
        type: actionTypes.GET_SUPPORT_SUCCESS,
        payload: {
          data: response.data[0],
          pagination: {
            total: response?.data?.length,
            page,
            limit,
            totalPages: Math.ceil(response.data[1] / limit),
          },
        },
      });
    } catch (err: any) {
      dispatch({ type: actionTypes.GET_SUPPORT_FAILURE, payload: err });
    }
  };
