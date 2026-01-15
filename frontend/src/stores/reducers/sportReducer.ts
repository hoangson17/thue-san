import actionTypes from "../actions/actionTypes";

const innitState = {
    sports: [] as any,
    loading: false,
    error: null,
};

const sportReducer = (state = innitState, action: any) => {
    switch (action.type) {
        case actionTypes.GET_ALL_SPORTS_REQUEST:
            return { ...state, loading: true, error: null };
        case actionTypes.GET_ALL_SPORTS_SUCCESS:
            return { ...state, loading: false, sports: action.payload };
        case actionTypes.GET_ALL_SPORTS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default sportReducer;