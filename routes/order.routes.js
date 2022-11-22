const express = require("express");
const {createOrder} = require("../controllers/orders.controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/orders", auth, createOrder);

module.exports = router;