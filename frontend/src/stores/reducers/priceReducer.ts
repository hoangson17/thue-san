import actionTypes from "../actions/actionTypes";

const initialState = {
    prices: [] as any,
    loading: false,
    error: null,
};

const priceReducer = (state = initialState, action: any) => {    
    switch (action.type) {
        case actionTypes.GET_PRICES_REQUEST:
            return { ...state, loading: true, error: null }
        case actionTypes.GET_PRICES_SUCCESS:
            return { ...state, loading: false, prices: action.payload }
        case actionTypes.GET_PRICES_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default:
            return state;
    }
};

export default priceReducer;