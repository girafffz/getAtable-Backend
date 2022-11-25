const express = require("express");
const router = express.Router();

const {
  getOneStaff,
  updateStaff,
  deleteStaff,
  createStaff,
  getAllStaff,
  createFirstManager,
  login,
} = require("../../controllers/restaurants/staff");

///////////////////  ENDPOINTS  ///////////////////
router.post("/staff/login", login);
router.put("/first-manager", createFirstManager);
router.patch("/:id/staff/update", updateStaff);
router.delete("/:id/staff/delete", deleteStaff);
router.put("/:id/staff/create", createStaff);
router.post("/:id/staff", getOneStaff);
router.get("/:id/staff", getAllStaff);

module.exports = router;
