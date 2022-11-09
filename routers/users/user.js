const express = require("express");
const router = express.Router();

const {
  getOneUser,
  updateUser,
  createUser,
  getAllUsers,
} = require("../../controllers/users/users");

///////////////////  ENDPOINTS  ///////////////////
router.post("/:user_id", getOneUser);
router.patch("/:user_id", updateUser);
router.put("/", createUser);
router.get("/", getAllUsers);

module.exports = router;
