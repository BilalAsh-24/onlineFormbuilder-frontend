import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined" || token === "") {
    console.log("TOKEN MISSING → redirect to login"); // Debug
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
