const db = require("../models");
const { Op } = require("sequelize");
const Order = db.orders;
const User = db.users;
const Role = db.roles;
const OrderProduct = db.orderproducts;
const Product = db.products;

// Fetch orders based on user role
exports.getOrdersByRole = async (req, res) => {
  try {
    const userId = req.userId; // Extracted from the token
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "name"], // Include role details
        },
      ],
    });

    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderProduct,
          as: "products", // Use the alias defined in the association
          include: [
            {
              model: Product,
              as: "product", // Use the alias defined in the association
              attributes: ["title",  "description", 'category'],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"], // Include user details
        },
      ],
    });

    res.status(200).json({ user, orders });
  } catch (error) {
    console.error("Error fetching orders by role:", error);
    res.status(500).json({ message: "Error fetching orders by role", error });
  }
};

// Create a new order
// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, products } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required to create an order" });
    }

    // Define today's start and end times
   const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1); // Move to yesterday
    startDate.setHours(12, 0, 0, 0);            // Set time to 12:00:00.000 PM

      // End date: Today at 3 PM
      const endDate = new Date();
      endDate.setHours(15, 0, 0, 0); // Set time to 3:00:00.000 PM

    // Check if an order for today already exists for this user
    const existingOrder = await Order.findOne({
      where: {
        user_id: userId,
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    if (existingOrder) {
      return res.status(400).json({ message: "Order already placed today" });
    }

    // Save the order
    const newOrder = await Order.create({ user_id: userId });

    // Save the associated products
    const orderProducts = products.map((product) => ({
      order_id: newOrder.id,
      product_id: product.productId,
      quantity: product.quantity,
    }));
    await OrderProduct.bulkCreate(orderProducts);

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error });
  }
};

// Fetch all orders with optional date filter
exports.findAll = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let whereCondition = {};

    if (startDate && endDate) {
      // Filter orders created between startDate and endDate
      whereCondition.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }

    const orders = await Order.findAll({
      where: whereCondition,
      include: [
        {
          model: OrderProduct,
          as: "products",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["title", "description", "category"],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};
// Fetch orders by user ID
// Fetch orders by user ID with optional date filter
exports.findByUserId = async (req, res) => {
  const userId = req.params.user_id;
  try {
    const { startDate, endDate } = req.query;
    let whereCondition = { user_id: userId };

    if (startDate && endDate) {
      whereCondition.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }

    const orders = await Order.findAll({
      where: whereCondition,
      include: [
        {
          model: OrderProduct,
          as: "products",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["title", "description", "category"],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by user ID:", error);
    res.status(500).json({ message: "Failed to fetch orders for user", error });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  const orderId = req.params.id;
  const { status, products } = req.body;

  try {
    // Update the order status
    await Order.update({ status }, { where: { id: orderId } });

    // Update returned quantities for products if status is 'returned' or 'received'
    if (products && products.length > 0) {
      for (const product of products) {
        // Try to update, if not found then insert (upsert logic)
        const [affectedRows] = await OrderProduct.update(
          {
            returned_quantity: product.returned_quantity || 0,
            recieved_quantity: product.recieved_quantity || 0,
            quantity: product.quantity || 0
          },
          { where: { order_id: orderId, product_id: product.product_id } }
        );

        if (affectedRows === 0) {
          // Only insert if this product is not already associated with the order
          await OrderProduct.create({
            order_id: orderId,
            product_id: product.product_id,
            returned_quantity: product.returned_quantity || 0,
            recieved_quantity: product.recieved_quantity || 0,
            quantity: product.quantity || 0
          });
        }
      }
    }

    res.status(200).json({ message: "Order updated successfully." });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Failed to update order.", error });
  }
};

// Add this new method to your existing controller

// Fetch orders by user (for users with role_id: 2) with optional date filter applied to orders
exports.getOrdersByUser = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    // Build an orders filter if dates are provided.
    let ordersWhere = {};
    if (startDate && endDate) {
      ordersWhere.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    // Use "required: false" to return users even if they have no orders within the date filter.
    const usersWithOrders = await User.findAll({
      where: { role_id: 2 },
      attributes: ['id', 'username', 'email'],
      include: [
        {
          model: Order,
          as: 'orders',
          where: Object.keys(ordersWhere).length ? ordersWhere : undefined,
          required: false,
          include: [
            {
              model: OrderProduct,
              as: 'products',
              include: [
                {
                  model: Product,
                  as: 'product',
                  attributes: ['title', 'description', 'category'],
                },
              ],
            },
          ],
        },
      ],
    });

    const formattedResponse = usersWithOrders.map(user => ({
      userId: user.id,
      username: user.username,
      email: user.email,
      orders: user.orders.map(order => ({
        orderId: order.id,
        status: order.status,
        createdAt: order.createdAt,
        products: order.products.map(op => ({
          title: op.product ? op.product.title : null,
          description: op.product ? op.product.description : null,
          category: op.product ? op.product.category : null,
          quantity: op.quantity
        }))
      }))
    }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Error fetching orders by user:", error);
    res.status(500).json({ message: "Failed to fetch orders by user", error });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deleted = await Order.destroy({ where: { id: orderId } });

    if (deleted) {
      res.status(200).json({ message: "Order deleted successfully." });
    } else {
      res.status(404).json({ message: "Order not found." });
    }
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order.", error });
  }
};