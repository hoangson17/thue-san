import categoriesService from "@/services/categoriesService";
import actionTypes from "./actionTypes";
import { toast } from "sonner";

export const getAllCategories =
  (page?: any, search = "") =>
  async (dispatch: any) => {
    dispatch({ type: actionTypes.GET_CATEGORIES_REQUEST });
    const limit = Number(import.meta.env.VITE_PAGE_LIMIT) || 8;
    try {
      const response = await categoriesService.getCategories({
        page,
        limit,
        search,
      });
      dispatch({
        type: actionTypes.GET_CATEGORIES_SUCCESS,
        payload: response.data,
      });
    } catch (err: any) {
      dispatch({ type: actionTypes.GET_CATEGORIES_FAILURE, payload: err });
    }
  };

export const getCategory = (id: string) => async (dispatch: any) => {
  dispatch({ type: actionTypes.GET_CATEGORY_REQUEST });
  try {
    const response = await categoriesService.getCategory(
      id as unknown as number,
    );
    dispatch({ type: actionTypes.GET_CATEGORY_SUCCESS, payload: response });
  } catch (err: any) {
    dispatch({ type: actionTypes.GET_CATEGORY_FAILURE, payload: err });
  }
};
