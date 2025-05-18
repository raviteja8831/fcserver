const { verifyToken } = require("../controllers/user.controller.js");

module.exports = (app) => {
  const orders = require("../controllers/order.controller.js");

  const router = require("express").Router();

  // Fetch orders based on user role
  router.get("/role-based", verifyToken, orders.getOrdersByRole);
  router.post('/create', orders.createOrder);


  // Other order routes
  router.get("/", orders.findAll);
  router.get("/user/:user_id", orders.findByUserId);
  router.put('/:id', orders.updateOrder);
  app.use("/api/orders", router);
  router.get("/by-user", orders.getOrdersByUser);

};