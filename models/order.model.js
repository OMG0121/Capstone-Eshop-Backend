const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
    address: Object,
    product: Object,
    quantity: Number,
    user: Object
});

const orders = mongoose.model("orders", ordersSchema)

module.exports = orders;