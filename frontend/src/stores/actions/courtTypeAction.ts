import courtTypeService from "@/services/courtTypeService";
import actionTypes from "./actionTypes";

export const getAllCourtTypes = () => async (dispatch: any) => {
    dispatch({ type: actionTypes.GET_ALL_COURTTYPES_REQUEST });
    try {
        const response = await courtTypeService.getAll();
        dispatch({
            type: actionTypes.GET_ALL_COURTTYPES_SUCCESS,
            payload: response.data,
        });
    } catch (err: any) {
        dispatch({ type: actionTypes.GET_ALL_COURTTYPES_FAILURE, payload: err });
    }
};
