import actionTypes from "../actions/actionTypes";

const initState = {
    courtTypes: [] as any,
    loading: false,
    error: null,
};

const courtTypeReducer = (state = initState, action: any) => {    
    switch (action.type) {
        case actionTypes.GET_ALL_COURTTYPES_REQUEST:
            return { ...state, loading: true, error: null }
        case actionTypes.GET_ALL_COURTTYPES_SUCCESS:
            return { ...state, loading: false, courtTypes: action.payload }
        case actionTypes.GET_ALL_COURTTYPES_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default:
            return state;
    }
};

export default courtTypeReducer;