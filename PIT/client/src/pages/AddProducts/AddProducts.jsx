import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import Header from "../HeaderAdm/Header"; 
import styles from "./AddProduct.module.css";

const AddProducts = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [file, setFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Erro ao carregar os produtos.");
    }
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();

    if (!name || !price || !description || !stock) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setSuccess("");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("stock", stock);
      if (file) formData.append("image", file);

      if (editId) {
        await axios.put(`/products/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Produto atualizado com sucesso!");
      } else {
        const response = await axios.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProducts([...products, response.data]);
        setSuccess("Produto adicionado com sucesso!");
      }

      setError("");
      setName("");
      setPrice("");
      setDescription("");
      setStock("");
      setFile(null);
      setPreview("");
      setEditId(null);
      fetchProducts();
    } catch (err) {
      console.error("Erro ao salvar produto:", err.response?.data || err.message);
      setError("Não foi possível salvar o produto.");
      setSuccess("");
    }
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setStock(product.stock);
    setPreview(product.imageUrl);
    setFile(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
      if (editId === id) {
        setEditId(null);
        setName("");
        setPrice("");
        setDescription("");
        setStock("");
        setFile(null);
        setPreview("");
      }
      setSuccess("Produto excluído com sucesso!");
      setError("");
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      setError("Não foi possível excluir o produto.");
      setSuccess("");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <h1>Adicionar Produtos</h1>
      <form onSubmit={handleAddOrUpdateProduct}>
        <label>
          Item:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Preço:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <label>
          Descrição:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Estoque:
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </label>
        <label>
          Imagem:
          <input type="file" onChange={handleFileChange} />
        </label>
        {preview && (
          <img
            src={preview}
            alt="Pré-visualização"
            className={styles.previewImage}
          />
        )}
        <button type="submit">
          {editId ? "Atualizar Produto" : "Adicionar Produto"}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <h2>Produtos Cadastrados</h2>
      <ul className={styles.productList}>
        {products.map((product) => (
          <li key={product.id} className={styles.productItem}>
            <div className={styles.productDetails}>
              <strong>{product.name}</strong>
              <p>R${product.price}</p>
              <p>Estoque: {product.stock}</p>
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className={styles.productImage}
                />
              )}
            </div>
            <div className={styles.productActions}>
              <button onClick={() => handleEdit(product)}>Editar</button>
              <button onClick={() => handleDelete(product.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddProducts;
