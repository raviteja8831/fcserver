module.exports = app => {
  const products = require("../controllers/product.controller.js");

  const router = require("express").Router();


  // Retrieve all Orders
  router.get("/", products.findAll);

  app.use("/api/products", router);
    app.use("/api/products/all", products.getAll);

  router.put("/:id/status", products.updateStatus);

};