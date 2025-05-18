module.exports = {
  HOST: "database-2.cjsqyckyc8sg.ap-south-1.rds.amazonaws.com",
  USER: "admin",
  PASSWORD: "oGO1pAtKTehM3rIyWndQ",
  DB: "frootcity_db",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
