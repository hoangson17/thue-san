import actionTypes from "../actions/actionTypes";

const innitState = {
    carosels: [],
    loading: false,
    error: null,
};

const caroselReducer = (state = innitState, action: any) => {
    switch (action.type) {
        case actionTypes.GET_CAROUSEL_REQUEST:
            return { ...state, loading: true, error: null };
        case actionTypes.GET_CAROUSEL_SUCCESS:
            return { ...state, loading: false, carosels: action.payload };
        case actionTypes.GET_CAROUSEL_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default caroselReducer;