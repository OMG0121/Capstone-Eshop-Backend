const express = require("express");
const {addAddress} = require("../controllers/address.controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/addresses", auth, addAddress);

module.exports = router;