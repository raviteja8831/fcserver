module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "roles", // Name of the roles table
        key: "id",      // Key in the roles table to reference
      },
    },
  });

  return User;
};