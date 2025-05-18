module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("products", {
    title: {
      type: Sequelize.STRING
    },
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: Sequelize.STRING
    },
    category: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.INTEGER
    }
  });

  return Product;
};
