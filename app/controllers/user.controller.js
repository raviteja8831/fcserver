const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = db.users;
const Role = db.roles;

// Secret key for JWT
const SECRET_KEY = "your_secret_key";

// User registration
exports.register = async (req, res) => {
  try {
    const { username, email, password, roleName } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find the role by name (default to "StoreAdmin" if not provided)
    const role = await Role.findOne({ where: { name: roleName || "StoreAdmin" } });
    if (!role) {
      return res.status(400).send({ message: "Role not found!" });
    }

    // Create a new user with the role's ID
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role_id: role.id, // Set the foreign key
    });

    res.status(201).send({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({
      where: { email },
      include: {
        model: Role,
        as: "role",
        attributes: ["name"], // Include only the role name
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid password!" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });

    // Get user roles
    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
      role_id:user.role_id
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Middleware to verify token
exports.verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};
const SupplyDate = db.supplydate;

// Get the current supply date
exports.getSupplyDate = async (req, res) => {
  try {
    const supplyDate = await SupplyDate.findAll();
    console.log(supplyDate, 'supplyDate')
    if (!supplyDate) {
      return res.status(404).send({ message: "Supply date not found!" });
    }
    res.status(200).send(supplyDate);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update the supply date
exports.updateSupplyDate = async (req, res) => {
  try {
    const { date, id } = req.body;

    if (!date) {
      return res.status(400).send({ message: "Date is required!" });
    }

    const supplyDate = await SupplyDate.findByPk(id);
    if (supplyDate) {
      // Update existing supply date
      supplyDate.supplydate = date;
      await supplyate.save();
    } else {
      // Create a new supply date if none exists
      res.status(500).send({ message: error.message });
    }

    res.status(200).send({ message: "Supply date updated successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};