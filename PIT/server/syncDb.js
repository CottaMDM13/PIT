const sequelize = require("./database/config");
const User = require("./models/User");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const Order = require("./models/Order");
const OrderItem = require("./models/OrderItem");

Cart.belongsTo(User, { foreignKey: "userId" });
Cart.belongsTo(Product, { foreignKey: "productId" });

Order.belongsTo(User, { foreignKey: "userId" });
Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("BD sincronizado com sucesso");
  } catch (error) {
    console.error("Erro ao sincronizar BD:", error);
    process.exit(1);
  }
};

syncDatabase();
