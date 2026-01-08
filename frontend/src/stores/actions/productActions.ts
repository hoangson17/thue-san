import actionTypes from "./actionTypes";
import { productService } from "../../services/productService";
import { toast } from "sonner";

export const getProducts =
  (page: number = 1, category: string = "", search: string = "") =>
  async (dispatch: any) => {
    dispatch({ type: actionTypes.GET_PRODUCTS_REQUEST });

    const limit = Number(import.meta.env.VITE_PAGE_LIMIT);

    try {
      const response = await productService.getProducts(
        page,
        limit,
        category,
        search
      );

      dispatch({
        type: actionTypes.GET_PRODUCTS_SUCCESS,
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
        type: actionTypes.GET_PRODUCTS_FAILURE,
        payload: err,
      });
    }
  };

export const getProductsByCategory =
  (category: string) => async (dispatch: any) => {
    dispatch({ type: actionTypes.GET_PRODUCTS_BY_CATEGORY_REQUEST });

    try {
      const data = await productService.getProductsByCategory(category);
      dispatch({
        type: actionTypes.GET_PRODUCTS_BY_CATEGORY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.GET_PRODUCTS_BY_CATEGORY_FAILURE,
        payload: error,
      });
    }
  };

export const getProductDetail = (id: string) => async (dispatch: any) => {
  dispatch({ type: actionTypes.GET_PRODUCT_DETAIL_REQUEST });
  try {
    const response = await productService.getProductDetail(id);
    dispatch({
      type: actionTypes.GET_PRODUCT_DETAIL_SUCCESS,
      payload: response,
    });
  } catch (err: any) {
    dispatch({ type: actionTypes.GET_PRODUCT_DETAIL_FAILURE, payload: err });
  }
};
