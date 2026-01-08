import actionTypes from "../actions/actionTypes";

const initialState = {
    supports: [] as any[],
    loading: false,
    error: null,
};

const supportReducer = (state = initialState, action: any) => {        
    switch (action.type) {
        case actionTypes.GET_SUPPORT_REQUEST:
            return { ...state, loading: true, error: null }
        case actionTypes.GET_SUPPORT_SUCCESS:
            return { ...state, loading: false, supports: action.payload }
        case actionTypes.GET_SUPPORT_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default:
            return state;
    }
};

export default supportReducer