import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/global.css";

// Handle SPA redirect from 404.html on GitHub Pages
const redirect = sessionStorage.getItem("redirect");
if (redirect) {
  sessionStorage.removeItem("redirect");
  // Extract the path after /markdown-site/
  const basePath = "/markdown-site";
  if (redirect.startsWith(basePath)) {
    const path = redirect.slice(basePath.length) || "/";
    window.history.replaceState(null, "", path);
  }
}

// Get base path from Vite config (for GitHub Pages /markdown-site subdirectory)
const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
