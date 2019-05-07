import { connectRouter, routerMiddleware } from "connected-react-router";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";

const reducers = { reducerOne: null, reducerTwo: null }; // normally you should import your reducers object here

// This is a factory func which produces corresponding stores for both server and client
export default function configureStore(history, initialState) {
  // Build middleware. These are functions that can process the actions before they reach the store.
  const windowIfDefined = typeof window === "undefined" ? null : window;
  const devToolsExtension =
    windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__;

  const store = createStore(
    buildRootReducer(reducers, history),
    initialState,
    compose(
      applyMiddleware(routerMiddleware(history)),
      devToolsExtension ? devToolsExtension() : f => f
    )
  );

  return store;
}

// Combines router reducer and app reducers

function buildRootReducer(appReducers, history) {
  return combineReducers({
    router: connectRouter(history),
    ...appReducers
  });
}
