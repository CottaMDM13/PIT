const router = require("express").Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

// Rota para listar itens do carrinho
router.get("/", auth, async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.userId },
      include: [{ model: Product }],
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar carrinho" });
  }
});

// Rota para adicionar itens ao carrinho
router.post("/", auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cartItem = await Cart.create({
      userId: req.userId,
      productId,
      quantity,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar item ao carrinho" });
  }
});

// Rota para editar item do carrinho
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await Cart.findByPk(id);
    if (!cartItem || cartItem.userId !== req.userId) {
      return res.status(404).json({ error: "Item do carrinho não encontrado" });
    }

    await cartItem.update({ quantity });
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar item do carrinho" });
  }
});

// Rota para remover item do carrinho
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await Cart.findByPk(id);
    if (!cartItem || cartItem.userId !== req.userId) {
      return res.status(404).json({ error: "Item do carrinho não encontrado" });
    }

    await cartItem.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover item do carrinho" });
  }
});

module.exports = router;
