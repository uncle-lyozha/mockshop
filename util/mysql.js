const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-udemy", "root", "eqdfvdctv8", 
{
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;