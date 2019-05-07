import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import React from "react";
import { hydrate } from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./configureStore";

// Create browser history to use in the Redux store.
const history = createBrowserHistory();

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState;

// Configure store with initial state that comes from server-side rendered html and newly created history
const store = configureStore(history, initialState);

// Renders app with hydrate so it can go on with the values where server left off
function renderApp() {
  hydrate(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div>your regular react router goes here</div>
      </ConnectedRouter>
    </Provider>,
    document.getElementById("react-app")
  );
}

renderApp();
