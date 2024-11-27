import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import AdminPage from "./pages/Dashboard/Dashboard";
import Cart from "./pages/Cart/Cart";
import Products from "./pages/Products/Products";
import Register from "./pages/Register/Register";
import AddProducts from "./pages/AddProducts/AddProducts";

// Componente de rota protegida
const ProtectedRoute = ({ requiredRole }) => {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
};

// Configuração das rotas
export const AppRoutes = () => {
  const { token, role } = useAuth();

  return (
    <Routes>
      {/* Página de login */}
      <Route path="/login" element={<Login />} />

      {/* Página de registro */}
      <Route path="/register" element={<Register />} />

      {/* Página padrão para usuários comuns */}
      <Route path="/home" element={<ProtectedRoute />}>
        <Route path="" element={<Home />} />
      </Route>

      {/* Página padrão para administradores */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="" element={<AdminPage />} />
        <Route path="add-products" element={<AddProducts />} />
      </Route>

      {/* Página de produtos */}
      <Route path="/products" element={<ProtectedRoute />}>
        <Route path="" element={<Products />} />
      </Route>

      {/* Página de carrinho */}
      <Route path="/cart" element={<ProtectedRoute />}>
        <Route path="" element={<Cart />} />
      </Route>

      {/* Redirecionamento padrão */}
      <Route
        path="*"
        element={
          token ? (
            role === "admin" ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/home" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
