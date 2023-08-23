const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-udemy",
  password: "eqdfvdctv8",
});

module.exports = pool.promise();