import actionTypes from "./actionTypes";
import { tournamentService } from "../../services/tournamentService";
import { toast } from "sonner";

export const getTournament = (page: number) => async (dispatch: any) => {
  dispatch({ type: actionTypes.GET_TOURNAMENT_REQUEST });
  const limit = import.meta.env.VITE_PAGE_LIMIT;
  try {
    const response = await tournamentService.getTournament(page, limit);
    dispatch({
      type: actionTypes.GET_TOURNAMENT_SUCCESS,
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
    dispatch({ type: actionTypes.GET_TOURNAMENT_FAILURE, payload: err });
  }
};

export const getTournamentDetail = (id: number) => async (dispatch: any) => {
  dispatch({ type: actionTypes.GET_TOURNAMENT_DETAIL_REQUEST });
  try {
    const response = await tournamentService.getTournamentById(id);
    dispatch({
      type: actionTypes.GET_TOURNAMENT_DETAIL_SUCCESS,
      payload: response,
    });
  } catch (err: any) {
    dispatch({ type: actionTypes.GET_TOURNAMENT_DETAIL_FAILURE, payload: err });
  }
};
