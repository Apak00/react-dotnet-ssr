import { createServerRenderer } from "aspnet-prerendering";
import { createMemoryHistory } from "history";
import React from "react";
import { renderToString } from "react-dom/server";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom";
import configureStore from "./configureStore";

function renderHelmet() {
  const helmetData = Helmet.renderStatic();
  let helmetStrings = "";
  const helmetDataKeys = Object.keys(helmetData);
  helmetDataKeys.forEach(key => {
    if (helmetData.hasOwnProperty(key)) {
      helmetStrings += helmetData[key].toString();
    }
  });
  return helmetStrings;
}
const createGlobals = (initialReduxState, helmetStrings) => ({
  initialReduxState,
  helmetStrings
});

export default createServerRenderer(params => {
  return new Promise(resolve => {
    //  Prepare Redux store with in-memory history
    const basename = params.baseUrl.substring(0, params.baseUrl.length - 1); // Remove trailing slash.
    const urlAfterBasename = params.url.substring(basename.length);
    const history = createMemoryHistory({
      initialEntries: [urlAfterBasename]
    });
    const store = configureStore(history);
    const routerContext = {};

    // Prepare an instance of the application
    const app = (
      <Provider store={store}>
        <StaticRouter
          basename={basename}
          context={routerContext}
          location={params.location.path}
        >
          <div>your regular react router goes here</div>
        </StaticRouter>
      </Provider>
    );
    const renderApp = () => {
      return renderToString(app);
    };

    //  If there's a redirection, just send this information back to the host application.
    if (routerContext.url) {
      resolve({
        redirectUrl: routerContext.url,
        globals: createGlobals(store.getState(), renderHelmet())
      });

      return;
    }
    //  We also send the redux store state, so the client can continue execution where the server left off.
    resolve({
      html: renderApp(),
      globals: createGlobals(store.getState(), renderHelmet())
    });
  });
});
