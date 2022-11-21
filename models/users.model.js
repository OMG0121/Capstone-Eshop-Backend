const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    createdAt: Date,
    email: String,
    first_name: String,
    last_name: String,
    password: String,
    phone_number: Number,
    role: String,
    updatedAt: Date,
    user_name: String
});

const users = mongoose.model("users", userSchema)

module.exports = users;