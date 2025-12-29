import actionTypes from "../actions/actionTypes";

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
      };

    case actionTypes.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        error: action.payload,
      };

    case actionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case actionTypes.LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default authReducer;
