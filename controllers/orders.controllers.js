const orders = require("../models/orders.model");
const products = require('../models/products.model');
const users = require("../models/users.model");
const address = require("../models/address.model");

const createOrder = async (req, res) => {
    let token = req.headers["x-access-token"];
    let productId = req.body.productId;
    let addressId = req.body.addressId;
    let quantity = req.body.quantity;
    
    let userData = await users.find({token: token});

    if (userData.length == 0) {
        res.status(401).send("Please Login first to access this endpoint!");
        return;
    }

    if (userData[0].role != "user") {
        res.status(403).send("You are not authorized to access this endpoint!");
        return;
    }

    let productsData = []

    try {productsData = await products.find({_id: productId})}
    catch(err) {
        res.status(200).send(`No Product found for ID - ${productId}!`);
        return;
    }

    let addressData = [];

    try {addressData = await address.find({_id: addressId})}
    catch(err) {
        res.status(200).send(`No Address found for ID - ${addressId}!`);
        return;
    }

    if (productsData[0].availableItems < quantity) {
        res.status(200).send(`Product with ID - ${productId} is currently out of stock!`);
        return;
    }

    orders.create({
        address: addressData[0]._id,
        product: productsData[0]._id,
        quantity: quantity,
        user: userData[0]._id
    }).then((data) => {
        res.status(200).send({"data":data, "status":"success"});
    }).catch((err) => {
        res.status(401).send(err);
    })

}

module.exports = {createOrder};