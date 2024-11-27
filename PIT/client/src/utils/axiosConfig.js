import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // URL base do backend
});

// Interceptor para adicionar o token no cabeçalho
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
