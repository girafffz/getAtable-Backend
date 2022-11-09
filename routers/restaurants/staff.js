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
router.patch("/:id/staff/:staff_id", updateStaff);
router.delete("/:id/staff/:staff_id", deleteStaff);
router.put("/:id/staff/", createStaff);
router.get("/:id/staff/", getAllStaff);

module.exports = router;
