const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Product = require("../models/Product");
const authenticate = require("../middleware/auth");

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Pasta de destino para os uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Endpoint para adicionar um produto (com upload de imagem, somente administradores)
router.post("/", authenticate, upload.single("image"), async (req, res) => {
  try {
    // Verifica se o usuário é administrador
    if (req.userRole !== "admin") {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const { name, price, description, stock } = req.body;

    // Validação dos campos obrigatórios
    if (!name || !price || !description || !stock) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Criação do produto com o caminho da imagem (se enviado)
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const product = await Product.create({ name, price, description, stock, image: imagePath });
    res.status(201).json(product);
  } catch (error) {
    console.error("Erro ao adicionar produto:", error.message);
    res.status(500).json({ error: "Erro ao adicionar produto." });
  }
});

// Endpoint para listar todos os produtos
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error.message);
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
});

// Endpoint para buscar um produto por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Erro ao buscar produto:", error.message);
    res.status(500).json({ error: "Erro ao buscar produto." });
  }
});
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, price, description, stock } = req.body;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    // Atualizar campos
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.stock = stock || product.stock;

    // Atualizar imagem, se enviada
    if (req.file) {
      product.image = req.file.path; // Atualize o caminho da imagem
    }

    await product.save();

    res.status(200).json({ message: "Produto atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ error: "Erro ao atualizar o produto." });
  }
});

// Rota para deletar um produto
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.destroy({ where: { id: productId } });

    if (deletedProduct) {
      res.status(200).json({ message: "Produto excluído com sucesso!" });
    } else {
      res.status(404).json({ error: "Produto não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    res.status(500).json({ error: "Erro ao excluir produto." });
  }
});


module.exports = router;
