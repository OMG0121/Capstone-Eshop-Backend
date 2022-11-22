const express = require("express");
const {signUP, login, logout} = require("../controllers/users.controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/users", signUP);

router.post("/auth/:email/:password", login);

router.post("/logout", auth, logout);

module.exports = router;