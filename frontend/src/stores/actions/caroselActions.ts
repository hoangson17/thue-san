import actionTypes from "./actionTypes";
import { caroselService } from "../../services/caroselService";
import { toast } from "sonner";

export const getCarosel = () => async (dispatch: any) => {
    dispatch({ type: actionTypes.GET_CAROUSEL_REQUEST });
    try {
        const response = await caroselService.getCarosel();
        dispatch({ type: actionTypes.GET_CAROUSEL_SUCCESS, payload: response });
    } catch (err: any) {
        dispatch({ type: actionTypes.GET_CAROUSEL_FAILURE, payload: err });
    }
}

