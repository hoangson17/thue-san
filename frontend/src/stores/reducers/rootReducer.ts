import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authReducer";
import actionTypes from "../actions/actionTypes";
import productsReducer from "./productsReducer";
import caroselReducer from "./caroselReducer";
import courtReducer from "./courtReducer";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"],
};

const appReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  products: productsReducer,
  carosels: caroselReducer,
  courts: courtReducer
});

const rootReducer = (state:any, action:any) => {
  if (action.type === actionTypes.LOGOUT) {
    state = {...state, auth: { user: null, accessToken: null, refreshToken: null, isAuthenticated: false }};
    storage.removeItem("persist:auth");
    storage.removeItem("accessToken");
    storage.removeItem("refreshToken");
  }
  return appReducer(state, action);
};

export default rootReducer;