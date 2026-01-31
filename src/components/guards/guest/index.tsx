import { Navigate, Outlet } from "react-router-dom";

export default function GuestGuard() {
  const token = localStorage.getItem("TOKEN_AUTH");

  if (token) {
    return <Navigate to="/workspaces" replace />;
  }

  return <Outlet />;
}
