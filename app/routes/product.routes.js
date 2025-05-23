module.exports = app => {
  const products = require("../controllers/product.controller.js");

  const router = require("express").Router();


  // Retrieve all Orders
  router.get("/", products.findAll);
    router.get("/all", products.getAll);

  app.use("/api/products", router);

  router.put("/:id/status", products.updateStatus);

};