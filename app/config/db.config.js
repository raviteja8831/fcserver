module.exports = {
  HOST: "localhost",
  USER: "admin",
  PASSWORD: "",
  DB: "frootcity_db",
  dialect: "mysql",
  timezone: "+05:30", // sets the timezone to IST
  dialectOptions: {
    useUTC: false,  // tell the MySQL driver not to convert dates to UTC
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};