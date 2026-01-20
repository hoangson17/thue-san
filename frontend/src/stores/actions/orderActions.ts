import actionTypes from "./actionTypes";
import { orderService } from "../../services/orderService";

export const getOrders =
  (page?: number, order?: string) => async (dispatch: any) => {
    dispatch({ type: actionTypes.GET_ALL_ORDER_PRODUCTS_REQUEST });
    const limit = import.meta.env.VITE_PAGE_LIMIT;
    try {
      const response = await orderService.findAll(page, limit, order);
      dispatch({
        type: actionTypes.GET_ALL_ORDER_PRODUCTS_SUCCESS,
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
      dispatch({
        type: actionTypes.GET_ALL_ORDER_PRODUCTS_FAILURE,
        payload: err,
      });
    }
  };
