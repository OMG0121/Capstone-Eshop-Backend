const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    name: String,
    city: String,
    state: String,
    street: String,
    contactNumber: String,
    landmark: String,
    zipCode: Number,
    user: Object
});

const address = mongoose.model("address", addressSchema)

module.exports = address;