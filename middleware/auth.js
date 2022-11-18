require("dotenv").config();

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers["authorization"].replace("Bearer ", ""); // Authorization : Bearer token is to be replace

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      req.decoded = decoded;
      next();
    } catch (err) {
      return res.status(401).send({
        status: "error",
        message: "unauthorized",
      });
    }
  } else {
    return res.status(403).send({
      status: "error",
      message: "missing token",
    });
  }
};

module.exports = auth;
