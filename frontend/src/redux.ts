import { applyMiddleware, createStore } from "redux"
import rootReducer from "./stores/reducers/rootReducer"
import { thunk } from "redux-thunk"
import { persistStore } from "redux-persist";

const reduxStore = () => {
    const store = createStore(rootReducer,applyMiddleware(thunk));
    const persistor = persistStore(store);
    
    return {store,persistor};
}

export default reduxStore;