const express = require("express");
const router = express.Router();

// const auth = require("../../middleware/auth");

const {
  getOneUser,
  updateUser,
  createUser,
  getAllUsers,
  login,
} = require("../../controllers/users/users");

///////////////////  ENDPOINTS  ///////////////////
router.post("/login", login);
router.put("/register", createUser);
router.post("/:user_id", getOneUser);
router.patch("/:user_id", updateUser);
router.get("/", getAllUsers);

module.exports = router;
