module.exports = (sequelize, Sequelize) => {
    const Supplydate = sequelize.define("supplydate", {
      supplydate: {
        type: Sequelize.STRING
      }
  
    });
  
    return Supplydate;
  };
  