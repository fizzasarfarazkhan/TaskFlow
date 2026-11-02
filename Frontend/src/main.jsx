import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  // Import Router for routing
import App from "./App";  // Import the main App component
import "./index.css";  // Import your global CSS styles

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>  {/* Wrap your app with BrowserRouter for routing */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
