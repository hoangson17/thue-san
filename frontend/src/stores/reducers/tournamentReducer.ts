import type { TournamentDetail } from "@/page/public"
import actionTypes from "../actions/actionTypes"

const initState = {
    tournaments: [],
    tournamentDetail: {},
    loading: false,
    error: null
}

const tournamentReducer = (state = initState, action: any) => {    
    switch (action.type) {
        case actionTypes.GET_TOURNAMENT_REQUEST:
            return { ...state, loading: true, error: null }
        case actionTypes.GET_TOURNAMENT_SUCCESS:
            return { ...state, loading: false, tournaments: action.payload }
        case actionTypes.GET_TOURNAMENT_FAILURE:
            return { ...state, loading: false, error: action.payload }
        case actionTypes.GET_TOURNAMENT_DETAIL_REQUEST:
            return { ...state, loading: true, error: null }
        case actionTypes.GET_TOURNAMENT_DETAIL_SUCCESS:
            return { ...state, loading: false, tournamentDetail: action.payload }
        case actionTypes.GET_TOURNAMENT_DETAIL_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default:
            return state;
    }
}

export default tournamentReducer