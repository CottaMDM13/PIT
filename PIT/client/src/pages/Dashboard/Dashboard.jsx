import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import Header from "../HeaderAdm/Header";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders");
        setOrders(response.data);
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
        setError("Não foi possível carregar os pedidos.");
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`/orders/${orderId}`, { status: newStatus });

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId || order._id === orderId
              ? { ...order, status: newStatus }
              : order
          )
        );
        setSuccess("Status atualizado com sucesso!");
        setError("");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Erro inesperado ao atualizar o status do pedido.");
      }
    } catch (err) {
      console.error("Erro ao atualizar status do pedido:", err);
      setError("Erro ao atualizar o status do pedido.");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pendente":
        return styles.statusPending;
      case "Preparando":
        return styles.statusPreparing;
      case "Pronto":
        return styles.statusReady;
      case "Cancelado":
        return styles.statusCanceled;
      default:
        return "";
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm("Tem certeza de que deseja excluir este pedido?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`/orders/${orderId}`);

      if (response.status === 200) {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId && order._id !== orderId));
        setSuccess("Pedido excluído com sucesso!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Erro inesperado ao excluir o pedido.");
      }
    } catch (err) {
      console.error("Erro ao excluir pedido:", err);
      setError("Erro ao excluir o pedido.");
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.header2}>
        <h1>Painel Administrativo</h1>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <h2 className={styles.titleLeft}>Pedidos</h2>
      {orders.length === 0 && !error ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <ul className={styles.orderList}>
          {orders.map((order) => (
            <li key={order.id || order._id} className={`${styles.orderItem} ${getStatusClass(order.status)}`}>
              <p>
                Pedido #{order.id || order._id} - Mesa {order.tableNumber} -{" "}
                {order.items.length} itens
              </p>
              <p>Status: {order.status}</p>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id || order._id, e.target.value)}
                className={styles.select}
              >
                <option value="Pendente">Pendente</option>
                <option value="Preparando">Preparando</option>
                <option value="Pronto">Pronto</option>
                <option value="Cancelado">Cancelado</option>
              </select>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteOrder(order.id || order._id)}
              >
                Excluir Pedido
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
