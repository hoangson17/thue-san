import actionTypes from "../actions/actionTypes";
import type { getProductsByCategory } from "../actions/productActions";

const initialState = {
    products: [] as any[],
    productsByCategory: [] as any[],
    productDetail: {},
    loading: false,
    error: null,
};

const productsReducer = (state = initialState, action: any) => {    
    switch (action.type) {
        case actionTypes.GET_PRODUCTS_REQUEST:
            return { 
                ...state, 
                loading: true, 
                error: null,
                productsByCategory: []
            };

        case actionTypes.GET_PRODUCTS_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                products: action.payload,
                productsByCategory: []
            };

        case actionTypes.GET_PRODUCTS_FAILURE:
            return { 
                ...state, 
                loading: false, 
                error: action.payload 
            };

        case actionTypes.GET_PRODUCTS_BY_CATEGORY_REQUEST:
            return { 
                ...state, 
                loading: true, 
                error: null,
                productsByCategory: []
            };

        case actionTypes.GET_PRODUCTS_BY_CATEGORY_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                productsByCategory: action.payload 
            };

        case actionTypes.GET_PRODUCTS_BY_CATEGORY_FAILURE:
            return { 
                ...state, 
                loading: false, 
                error: action.payload 
            };

        case actionTypes.GET_PRODUCT_DETAIL_REQUEST:
            return { 
                ...state, 
                loading: true, 
                error: null,
                productDetail: {}
            };

        case actionTypes.GET_PRODUCT_DETAIL_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                productDetail: action.payload 
            };

        case actionTypes.GET_PRODUCT_DETAIL_FAILURE:
            return { 
                ...state, 
                loading: false, 
                error: action.payload 
            };

        default:
            return state;
    }
};

export default productsReducer;
