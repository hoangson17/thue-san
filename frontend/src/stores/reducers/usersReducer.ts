import actionTypes from "../actions/actionTypes";
const initialState = {
    getUsers: [],
    getUsersLock: [],
    loading: false,
    error: "",
};

export const usersReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_ALL_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        getUsers: action.payload.data,
        pagination: action.payload.pagination,
      };

    case actionTypes.GET_ALL_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case actionTypes.GET_USER_LOCKED_FAILURE:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.GET_USER_LOCKED_SUCCESS:
      return {
        ...state,
        loading: false,
        getUsersLock: action.payload.data,
        pagination: action.payload.pagination,
      };

    case actionTypes.GET_USER_LOCKED_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
