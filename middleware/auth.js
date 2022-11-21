const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) return res.status(401).send("Please Login first to access this endpoint!");
  try {
    jwt.verify(token, "myprivatekey");
    console.log("Auth Successfull");
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
    console.log("Auth Unsuccessfull");
  }
};