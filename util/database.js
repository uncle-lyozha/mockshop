require('dotenv').config();
const mongodb = require("mongodb");
const { get } = require("../routes/admin");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    `mongodb+srv://${process.env.USER}:${process.env.PASS}@mockshop.o4n7ofw.mongodb.net/shop?retryWrites=true&w=majority`
  )
    .then(client => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found."; 
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;