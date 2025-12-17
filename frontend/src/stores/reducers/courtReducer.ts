import actionTypes from "../actions/actionTypes";

const initialState = {
    courts: [] as any[],
    court: {},
    loading: false,
    error: null,
};

const courtReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.GET_COURT_REQUEST:
            return { ...state, loading: true, error: null }
        case actionTypes.GET_COURT_SUCCESS:
            return { ...state, loading: false, courts: action.payload }
        case actionTypes.GET_COURT_FAILURE:
            return { ...state, loading: false, error: action.payload }
        case actionTypes.GET_DETAIL_COURT_REQUEST:
            return { ...state, loading: true, error: null }
        case actionTypes.GET_DETAIL_COURT_SUCCESS:
            return { ...state, loading: false, court: action.payload }
        case actionTypes.GET_DETAIL_COURT_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default:
            return state;
    }
};

export default courtReducer;