import { createStore } from "redux";
import userReducer from "./userReducer";

const configureStore = () => {
  const store = createStore(
    userReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
};

export default configureStore;
