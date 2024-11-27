const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar campos obrigatórios
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    // Verificar se o email já está cadastrado
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // Criar o usuário (a senha será hasheada automaticamente na model)
    const user = await User.create({ name, email, password, role });

    // Remover a senha do retorno
    user.password = undefined;

    // Gerar o token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "sua_chave_secreta",
      {
        expiresIn: "1d", // Token válido por 1 dia
      }
    );

    // Retornar o usuário e o token
    res.json({ user, token });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, // Inclui a role no token
      process.env.JWT_SECRET || "sua_chave_secreta",
      {
        expiresIn: "1d",
      }
    );

    user.password = undefined; // Remove a senha antes de enviar ao cliente
    res.json({ token, role: user.role }); // Retorna a role na resposta
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});


module.exports = router;
