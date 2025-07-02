import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import type { AuthState } from "../store/authStore";
import type { JSX } from "react";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const accessToken = useAuthStore((state: AuthState) => state.accessToken) 
    || localStorage.getItem("access_token");

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return children;
}
