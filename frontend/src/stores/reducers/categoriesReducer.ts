import actionTypes from "../actions/actionTypes";

const initialState = {
  categories: [],
  category: {},
  loading: false,
  error: null,
}

const categoriesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_CATEGORIES_REQUEST:
      return { ...state, loading: true, error: null };
    case actionTypes.GET_CATEGORIES_SUCCESS:
      return { ...state, loading: false, categories: action.payload, error: null };
    case actionTypes.GET_CATEGORIES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case actionTypes.GET_CATEGORY_REQUEST:
      return { ...state, loading: true, error: null };
    case actionTypes.GET_CATEGORY_SUCCESS:
      return { ...state, loading: false, category: action.payload, error: null };
    case actionTypes.GET_CATEGORY_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default categoriesReducer;
