import React, { useState, useEffect } from "react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import axios from "../../utils/axiosConfig";
import Header from "../../components/Header/Header";
import styles from "./Cart.module.css"; 
import Footer from "../../components/Footer/Footer";

const Cart = () => {
  const { cart, removeFromCart, updateItemQuantity, clearCart } = useCart();
  const { token } = useAuth(); // Obtém o token de autenticação
  const [mesa, setMesa] = useState("");
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  const [total, setTotal] = useState(0); // Estado para armazenar o total

  useEffect(() => {
    const calculateTotal = () => {
      const totalValue = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotal(totalValue.toFixed(2));
    };

    calculateTotal();
  }, [cart]);

  const handlePedido = async () => {
    const numeroMesa = prompt("Informe o número da mesa:");

    if (numeroMesa) {
      try {
        await axios.post("/orders", {
          tableNumber: numeroMesa,
          items: cart,
        });

        setMesa(numeroMesa);
        setPedidoConfirmado(true);
        clearCart();
        alert("Pedido realizado com sucesso!");
      } catch (error) {
        console.error("Erro ao realizar pedido:", error);
        alert("Erro ao realizar o pedido. Tente novamente.");
      }
    }
  };

  return (
    <div className={styles.topo}>
      <Header />
      <h1>Carrinho</h1>
      {pedidoConfirmado && (
        <p style={{ color: "green" }}>
          Pedido realizado com sucesso para a mesa {mesa}!
        </p>
      )}
      {cart.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <div className={styles.div}>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                <h2>{item.name}</h2>
                <p>Preço: R$ {item.price}</p>
                <div>
                  <label>Quantidade: </label>
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItemQuantity(item.id, parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <button onClick={() => removeFromCart(item.id)}>Remover</button>
              </li>
            ))}
          </ul>
          <h3>Total: R$ {total}</h3>
          <div className={styles.buttonsContainer}>
            <button className={styles.orderButton} onClick={handlePedido}>
              Realizar Pedido
            </button>
            <button className={styles.clearButton} onClick={clearCart}>
              Esvaziar Carrinho
            </button>
          </div>
        </div>
      )}
       <Footer />
    </div>
  );
};

export default Cart;
