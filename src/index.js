import React from "react";
import ReactDOM from "react-dom";
// import { Route, Router, browserHistory } from "react-router";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import ReduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";

import App from "./components/App";
import Home from "./containers/Home";
import reducers from "./reducers";

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(ReduxPromise))
);

ReactDOM.render(
  <Provider store={store}>
    <App>
      <Home />
    </App>
  </Provider>,
  document.querySelector(".myApp")
);

{
  /* <Router history={browserHistory} >
<Route component={App}>
<Route path="/" component={Home} />
</Route>
</Router> */
}
