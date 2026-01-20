import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authReducer";
import actionTypes from "../actions/actionTypes";
import productsReducer from "./productsReducer";
import caroselReducer from "./caroselReducer";
import courtReducer from "./courtReducer";
import tournamentReducer from "./tournamentReducer";
import { usersReducer } from "./usersReducer";
import cartReducer from "./cartReducer";
import supportReducer from "./supportReducer";
import categoriesReducer from "./categoriesReducer";
import priceReducer from "./priceReducer";
import sportReducer from "./sportReducer";
import courtTypeReducer from "./courtTypeReducer";
import bookingReducer from "./booking";
import orderReducer from "./oderReducer";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"],
};

const appReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  products: productsReducer,
  carosels: caroselReducer,
  courts: courtReducer,
  tournaments: tournamentReducer,
  users: usersReducer,
  cart: cartReducer,
  supports: supportReducer,
  categories: categoriesReducer,
  prices: priceReducer,
  sports: sportReducer,
  courtTypes: courtTypeReducer,
  bookings: bookingReducer,
  orders: orderReducer
});

const rootReducer = (state: any, action: any) => {
  if (action.type === actionTypes.LOGOUT) {
    storage.removeItem("persist:auth");
    storage.removeItem("accessToken");
    storage.removeItem("refreshToken");
  }
  return appReducer(state, action);
};


export default rootReducer;