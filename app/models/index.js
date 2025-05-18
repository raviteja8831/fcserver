const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.products = require("./product.model.js")(sequelize, Sequelize);
db.orders = require("./order.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.roles = require("./role.model.js")(sequelize, Sequelize);
db.supplydate = require("./supplydate.model.js")(sequelize, Sequelize);
db.orderproducts = require("./orderproducts.model.js")(sequelize, Sequelize);
module.exports = db;

db.users.belongsTo(db.roles, {
  foreignKey: "role_id",
  as: "role",
});

db.roles.hasMany(db.users, {
  foreignKey: "role_id",
  as: "users",
});

db.orders.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "user",
});

db.users.hasMany(db.orders, {
  foreignKey: "user_id",
  as: "orders",
});


db.orderproducts.belongsTo(db.orders, {
  foreignKey: "order_id",
  as: "order", // Alias for the association
});

db.orders.hasMany(db.orderproducts, {
  foreignKey: "order_id",
  as: "products", // Alias for the association
});

db.orderproducts.belongsTo(db.products, {
  foreignKey: "product_id",
  as: "product", // Alias for the association
});

db.products.hasMany(db.orderproducts, {
  foreignKey: "product_id",
  as: "orderproducts", // Alias for the association
});