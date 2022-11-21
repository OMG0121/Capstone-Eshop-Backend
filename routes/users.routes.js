const express = require("express");
const {signUP, login} = require("../controllers/users.controller");

const router = express.Router();

router.post("/users", signUP);

router.post("/auth/:email/:password", login);

module.exports = router;