import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { appRuntimeConfig } from "./config/apiConfig";

// Expose resolved config for debugging deployed builds (Amplify/CDN).
// In the browser console: window.__APP_CONFIG__
// eslint-disable-next-line no-underscore-dangle
window.__APP_CONFIG__ = appRuntimeConfig;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);