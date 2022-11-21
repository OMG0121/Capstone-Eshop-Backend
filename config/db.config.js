const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/Eshop";

//setting up the database object
const db = {};
db.mongoose = mongoose;
db.url = url;

//Address database object --> passing mongoose as a parameter
db.Address = require('./address.model')(mongoose);

//Order database object --> passing mongoose as a parameter
db.Orders = require('./order.model')(mongoose);

//Product database object --> passing mongoose as a parameter
db.Product = require('./product.model')(mongoose);

//User database object --> passing mongoose as a parameter
db.User = require('./user.model')(mongoose);

module.exports = db;