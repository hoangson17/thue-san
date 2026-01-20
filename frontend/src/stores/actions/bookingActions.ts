import { bookingService } from "@/services/bookingService";
import actionTypes from "./actionTypes";

export const getBookings = () => async (dispatch: any) => {
    dispatch({ type: actionTypes.GET_ALL_BOOKINGS_REQUEST });
    try {
        const res = await bookingService.findAll();
        dispatch({ type: actionTypes.GET_ALL_BOOKINGS_SUCCESS , payload: res });
    } catch (err: any) {
        dispatch({ type: actionTypes.GET_ALL_BOOKINGS_FAILURE, payload: err });
    }
};

export const getBookingAdmin = (page?: any, order?: any, search?: any) => async (dispatch: any) => {
    dispatch({ type: actionTypes.GET_ALL_BOOKING_ADMIN_REQUEST });
    const limit = Number(import.meta.env.VITE_PAGE_LIMIT) || 8;
    try {
        const res = await bookingService.findAllAdmin(page, limit, order, search);
        dispatch({ type: actionTypes.GET_ALL_BOOKING_ADMIN_SUCCESS, payload: res });
    } catch (err: any) {
        dispatch({ type: actionTypes.GET_ALL_BOOKING_ADMIN_FAILURE, payload: err });
    }
}

export const getBookingsByUser = () => async (dispatch: any) => {
    dispatch({ type: actionTypes.GET_ALL_BOOKING_BY_USER_REQUEST });
    try {
        const res = await bookingService.findAllByUser();        
        dispatch({ type: actionTypes.GET_ALL_BOOKING_BY_USER_SUCCESS, payload: res });
    } catch (err: any) {
        dispatch({ type: actionTypes.GET_ALL_BOOKING_BY_USER_FAILURE, payload: err });
    }
};