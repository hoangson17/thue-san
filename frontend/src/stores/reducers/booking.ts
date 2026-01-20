import actionTypes from "../actions/actionTypes";

const initialState = {
    bookings: [] as any,
    bookingsByUser: [] as any,
    bookingAdmin: [] as any,
    loading: false,
    error: null,
};

const bookingReducer = (state = initialState, action: any) => {    
    switch (action.type) {
        case actionTypes.GET_ALL_BOOKINGS_REQUEST:
            return { ...state, loading: true, error: null }
        case actionTypes.GET_ALL_BOOKINGS_SUCCESS:
            return { ...state, loading: false, bookings: action.payload }
        case actionTypes.GET_ALL_BOOKINGS_FAILURE:
            return { ...state, loading: false, error: action.payload }
        case actionTypes.GET_ALL_BOOKING_BY_USER_REQUEST:
            return { ...state, loading: true, error: null }
        case actionTypes.GET_ALL_BOOKING_BY_USER_SUCCESS:
            return { ...state, loading: false, bookingsByUser: action.payload }
        case actionTypes.GET_ALL_BOOKING_BY_USER_FAILURE:
            return { ...state, loading: false, error: action.payload }
        case actionTypes.GET_ALL_BOOKING_ADMIN_REQUEST:
            return { ...state, loading: true, error: null }
        case actionTypes.GET_ALL_BOOKING_ADMIN_SUCCESS:
            return { ...state, loading: false, bookingAdmin: action.payload }
        case actionTypes.GET_ALL_BOOKING_ADMIN_FAILURE:
            return { ...state, loading: false, error: action.payload }

        default:
            return state;
    }
};

export default bookingReducer;