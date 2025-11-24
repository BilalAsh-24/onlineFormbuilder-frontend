import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";  // 👈 Bootstrap CSS
import "./index.css";                           // 👈 your custom tweaks (optional)
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
