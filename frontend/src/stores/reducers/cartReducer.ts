import actionTypes from "../actions/actionTypes";

const initialState = {
    cart: [] as any,
    loading: false,
    error: null,
};

const cartReducer = (state = initialState, action: any) => {    
    switch (action.type) {
        case actionTypes.GET_CART_REQUEST:
            return { ...state, loading: true, error: null }
        case actionTypes.GET_CART_SUCCESS:
            return { ...state, loading: false, cart: action.payload }
        case actionTypes.GET_CART_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default:
            return state;
    }
};

export default cartReducer;