module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("orders", {
  
    user_id: {
      type: Sequelize.INTEGER
    },
    status: {
      type: Sequelize.STRING
    }
  });

  return Order;
};
