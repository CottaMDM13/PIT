const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product"); // Modelo de Produto
const authenticate = require("../middleware/auth"); // Middleware de autenticação

// Rota para criar um pedido (protegida)
router.post("/", authenticate, async (req, res) => {
  try {
    const { tableNumber, items } = req.body;

    if (!tableNumber || !items || items.length === 0) {
      return res.status(400).json({ error: "Dados inválidos." });
    }

    // Atualizar o estoque dos produtos
    for (const item of items) {
      const product = await Product.findByPk(item.id); // Busca o produto pelo ID
      if (!product) {
        return res.status(404).json({ error: `Produto com ID ${item.id} não encontrado.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Estoque insuficiente para o produto "${product.name}".`,
        });
      }

      // Reduz o estoque do produto
      product.stock -= item.quantity;
      await product.save();
    }

    // Criar o pedido
    const order = await Order.create({ tableNumber, items });
    res.status(201).json(order);
  } catch (error) {
    console.error("Erro ao criar pedido:", error.message);
    res.status(500).json({ error: "Erro ao criar pedido." });
  }
});

// Rota para buscar todos os pedidos (protegida)
router.get("/", authenticate, async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const orders = await Order.findAll({ order: [["createdAt", "DESC"]] });
    res.json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error.message);
    res.status(500).json({ error: "Erro ao buscar pedidos." });
  }
});

// Rota para atualizar o status do pedido
router.put("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validar o status
  const validStatuses = ["Pendente", "Preparando", "Pronto", "Cancelado"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Status inválido." });
  }

  try {
    const order = await Order.findByPk(id); // Busca pelo ID usando Sequelize
    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    // Atualizar o status do pedido
    await order.update({ status });
    res.status(200).json(order); // Retorna o pedido atualizado
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error.message);
    res.status(500).json({ message: "Erro ao atualizar o status do pedido." });
  }
});

// Rota para excluir pedido
router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id); // Busca pelo ID usando Sequelize
    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    await order.destroy(); // Exclui o pedido
    res.status(200).json({ message: "Pedido excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir pedido:", error.message);
    res.status(500).json({ message: "Erro ao excluir pedido." });
  }
});

module.exports = router;
