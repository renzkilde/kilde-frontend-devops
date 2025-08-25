import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Redux/Store";

import "./index.css";
import "./antd-style.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CLIENT_ID } from "./Utils/Constant";
import SnackbarProvider from "react-simple-snackbar";
import GlobalVariabels from "./Utils/GlobalVariabels";

let currentEnv = GlobalVariabels.NODE_ENV;

Sentry.init({
  dsn: "https://126e42e9cb4a8f099af5bce9545b15c8@o4508804318625792.ingest.us.sentry.io/4508804320591872",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.captureConsoleIntegration({
      levels: ["error"],
    }),
  ],
  environment:
    currentEnv === "DEV"
      ? "development"
      : currentEnv === "STAGING"
      ? "staging"
      : "production",
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId={CLIENT_ID.GOOGLE_CLIENTID}>
    <Provider store={store}>
      <BrowserRouter>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
