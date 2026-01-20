import actionTypes from "../actions/actionTypes";

const initialState = {
    orders: [] as any[],
    loading: false,
    error: null,
};

const orderReducer = (state = initialState, action: any) => {    
    switch (action.type) {
        case actionTypes.GET_ALL_ORDER_PRODUCTS_REQUEST:
            return { ...state, loading: true, error: null }
        case actionTypes.GET_ALL_ORDER_PRODUCTS_SUCCESS:
            return { ...state, loading: false, orders: action.payload }
        case actionTypes.GET_ALL_ORDER_PRODUCTS_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default:
            return state;
    }
};

export default orderReducer