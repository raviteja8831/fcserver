const db = require("../models");
const Product = db.products;
const Op = db.Sequelize.Op;


// Retrieve all Products from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title 
    ? { title: { [Op.like]: `%${title}%` }, status: 1 } 
    : { status: 1 };

  Product.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Update the status of a Product by ID
exports.updateStatus = (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  if (status === undefined || status === null) {
    return res.status(400).send({
      message: "Status cannot be empty!"
    });
  }

  Product.update({ status }, { where: { id } })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Product status was updated successfully."
        });
      } else {
        res.status(404).send({
          message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating Product with id=${id}`
      });
    });
};


