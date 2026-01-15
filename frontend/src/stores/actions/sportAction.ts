import actionTypes from "./actionTypes";
import { sportService } from "../../services/sportService";

export const getAllSports = () => async (dispatch: any) => {
  dispatch({ type: actionTypes.GET_ALL_SPORTS_REQUEST });
  try {
    const response = await sportService.getSports();
    dispatch({ type: actionTypes.GET_ALL_SPORTS_SUCCESS, payload: response });
  } catch (error) {
    dispatch({ type: actionTypes.GET_ALL_SPORTS_FAILURE, payload: error });
  }
};
