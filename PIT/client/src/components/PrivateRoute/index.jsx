import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PrivateRoute = ({ requiredRole }) => {
  const { token, role } = useAuth();

  if (!token) {
    alert("Sua sessão expirou. Faça login novamente.");
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    alert("Você não tem permissão para acessar esta página.");
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
