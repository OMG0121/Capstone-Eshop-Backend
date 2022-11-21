const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
    name: String,
    category: String,
    manufacturer: String,
    availableItems: Number,
    price: Number,
    imageURL: String,
    description: String,
    updateAt: Date,
    createdAt: Date
});

const products = mongoose.model("products", productsSchema)

module.exports = products;