import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import style from "./Register.module.css";
import { useAuth } from "../../contexts/AuthContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const userRole = email.includes("@exemplo.com") ? "admin" : "user";

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: username,
          email,
          password,
          role: userRole,
        }
      );

      const { token, role: userRoleResponse } = response.data;

      login(token, userRoleResponse);

      if (userRoleResponse === "admin") {
        localStorage.setItem("role", "admin");
        navigate("/login");
      } else {
        localStorage.setItem("role", "user");
        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Erro ao cadastrar");
    }
  };

  return (
    <div className={style.cadastro}>
      <form onSubmit={handleRegister}>
        <h1 className={style.titulo}>Cadastrar</h1>
        <div className="register-container">
          <input
            type="text"
            value={username}
            placeholder="Nome de Usuário"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="register-container">
          <input
            type="email"
            value={email}
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="register-container">
          <input
            type="password"
            value={password}
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className={style.error}>{error}</p>}
        <button type="submit" className={style.cadastrarButton}>
          Cadastrar
        </button>
        <button
          type="button"
          className={style.loginButton}
          onClick={() => navigate("/login")}
        >
          Já possui uma conta? Faça login
        </button>
      </form>
    </div>
  );
};

export default Register;
