import { courtService } from "@/services/courtService";
import actionTypes from "./actionTypes";

export const getCourt = () => async (dispatch: any) => {
    dispatch({ type: actionTypes.GET_COURT_REQUEST });
    try {
        const response = await courtService.getCourt();
        dispatch({ type: actionTypes.GET_COURT_SUCCESS, payload: response });
    } catch (err: any) {
        dispatch({ type: actionTypes.GET_COURT_FAILURE, payload: err });
    }
}

export const getDetailCourt = (id: string) => async (dispatch: any) => {
    dispatch({ type: actionTypes.GET_DETAIL_COURT_REQUEST });
    try {
        const response = await courtService.getCourtDetail(id);
        dispatch({ type: actionTypes.GET_DETAIL_COURT_SUCCESS, payload: response });
    } catch (err: any) {
        dispatch({ type: actionTypes.GET_DETAIL_COURT_FAILURE, payload: err });
    }
}