import actionTypes from "./actionTypes";
import { priceService } from "../../services/priceService";
import { toast } from "sonner";

export const getPrices =
  (page?: number, search?: string, order?:string) =>
  async (dispatch: any) => {
    dispatch({ type: actionTypes.GET_PRICES_REQUEST });

    const limit = Number(import.meta.env.VITE_PAGE_LIMIT);

    try {
      const response = await priceService.getPrices(page, limit, search, order);    
      dispatch({
        type: actionTypes.GET_PRICES_SUCCESS,
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
      toast.error("Không thể tải bảng giá");
      dispatch({
        type: actionTypes.GET_PRICES_FAILURE,
        payload: err,
      });
    }
  };
