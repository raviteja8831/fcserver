module.exports = app => {
  const users = require("../controllers/user.controller.js");

  const router = require("express").Router();
router.get('/', users.getAllUsers);

  // User registration
  router.post("/register", users.register);

  // User login
  router.post("/login", users.login);
  // Route for updating user details (token verification middleware added)
router.put('/update', users.updateUserDetails);

  router.get("/supplydate", users.getSupplyDate); // Get supply date
  router.put("/supplydate", users.updateSupplyDate); // Update supply date
  // Middleware to verify token (example usage for protected routes)
  router.get("/protected", users.verifyToken, (req, res) => {
    res.status(200).send({ message: "This is a protected route!" });
  });

  app.use("/api/users", router);
};