import { cartService } from "@/services/cartService";
import actionTypes from "./actionTypes";

export const getCart = () => async (dispatch: any) => {
    dispatch({ type: actionTypes.GET_CART_REQUEST });
    try {
        const response = await cartService.getCart();
        dispatch({ type: actionTypes.GET_CART_SUCCESS, payload: response });
    } catch (err: any) {
        dispatch({ type: actionTypes.GET_CART_FAILURE, payload: err });
    }
}