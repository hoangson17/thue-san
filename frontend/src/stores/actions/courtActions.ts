import { courtService } from "@/services/courtService";
import actionTypes from "./actionTypes";

export const getCourts = (page?: number,order?: string, search?: string) => async (dispatch: any) => {
  dispatch({ type: actionTypes.GET_COURT_REQUEST });
  const limit = import.meta.env.VITE_PAGE_LIMIT;
  try {
    const response = await courtService.getCourt(page, limit, order, search);    
    // console.log(response);
    
    dispatch({
      type: actionTypes.GET_COURT_SUCCESS,
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
    dispatch({ type: actionTypes.GET_COURT_FAILURE, payload: err });
  }
};

export const getDetailCourt = (id: string) => async (dispatch: any) => {
  dispatch({ type: actionTypes.GET_DETAIL_COURT_REQUEST });
  try {
    const response = await courtService.getCourtDetail(id);
    dispatch({ type: actionTypes.GET_DETAIL_COURT_SUCCESS, payload: response });
  } catch (err: any) {
    dispatch({ type: actionTypes.GET_DETAIL_COURT_FAILURE, payload: err });
  }
};
