const express = require("express");
const router = express.Router();

const {
  getOneStaff,
  updateStaff,
  deleteStaff,
  createStaff,
  getAllStaff,
} = require("../../controllers/restaurants/staff");

///////////////////  ENDPOINTS  ///////////////////
router.post("/:id/staff/:staff_id", getOneStaff);
router.patch("/:id/staff/update", updateStaff);
router.delete("/:id/staff/delete", deleteStaff);
router.put("/:id/staff/create", createStaff);
router.get("/:id/staff/", getAllStaff);

module.exports = router;
