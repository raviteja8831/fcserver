module.exports = (sequelize, Sequelize) => {
  const OrdersProducts = sequelize.define("orderproducts", {
    quantity: {
      type: Sequelize.INTEGER
    },
    recieved_quantity: {
      type: Sequelize.INTEGER
    },
    returned_quantity: {
      type: Sequelize.INTEGER
    },
    order_id: {
      type: Sequelize.INTEGER
    },
    product_id: {
      type: Sequelize.INTEGER
    }
  });

  return OrdersProducts;
};
