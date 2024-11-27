import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import styles from "./Login.module.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", { email, password });
      const { token, role } = response.data;
      login(token, role); // Salva no AuthContext

      // Redireciona baseado no papel do usuário
      if (role === "admin") {
        navigate("/admin/");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Credenciais inválidas. Tente novamente.");
    }
    
  };

  return (
    <div className={styles.login}>
      <form onSubmit={handleLogin} className={styles.form}>
        <h1 className={styles.title}>Login</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.loginButton}>
          Entrar
        </button>
        <button
          type="button"
          className={styles.registerButton}
          onClick={() => navigate("/register")}
        >
          Não tem uma conta? Cadastre-se
        </button>
      </form>
    </div>
  );
};

export default Login;
