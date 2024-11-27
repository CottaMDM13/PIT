const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("restaurante_db", "root", "jhonatan009009", {
  host: "localhost",
  dialect: "mysql", // ou 'postgres', 'sqlite', 'mariadb', etc., dependendo do seu banco de dados
});

module.exports = sequelize;

