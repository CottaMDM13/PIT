import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../../contexts/CartContext";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./Products.module.css";


const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Estado para mensagem de sucesso
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");

        if (Array.isArray(response.data)) {
          // Atualiza os produtos e converte caminhos de imagem locais em URLs temporárias
          const updatedProducts = response.data.map((product) => {
            if (product.image) {
              return {
                ...product,
                imageUrl: product.image.startsWith("/uploads") 
                ? `http://localhost:5000${product.image}` // Concatena URL base
                : product.image, 
              };
            }
            return product;
          });
          setProducts(updatedProducts);
        } else {
          setError("Formato inesperado de resposta da API.");
        }
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError("Não foi possível carregar os produtos.");
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setSuccessMessage(`O produto "${product.name}" foi adicionado ao carrinho!`);

    // Limpa a mensagem após 3 segundos
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div>
      <Header />
      <h1>Produtos</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {products.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <ul className={styles.ul}>
          {products.map((product) => (
            <li key={product.id}>
              <h2>{product.name}</h2>
              <p>Preço: R$ {product.price}</p>
              <p>{product.description}</p>
              <small>Categoria: {product.category}</small>
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{
                    width: "200px",
                    height: "auto",
                    marginTop: "10px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                />
              )}
              <button onClick={() => handleAddToCart(product)}>
                Adicionar ao Carrinho
              </button>
            </li>
          ))}
        </ul>
      )}
      <Footer/>
    </div>
  );
};

export default Products;
