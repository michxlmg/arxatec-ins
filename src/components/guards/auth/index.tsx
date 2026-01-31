import { Navigate, Outlet } from "react-router-dom";

export default function AuthGuard() {
  const token = localStorage.getItem("TOKEN_AUTH");

  if (!token) {
    // If NOT authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
