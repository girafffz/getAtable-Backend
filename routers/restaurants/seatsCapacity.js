const express = require("express");
const router = express.Router();

const {
  getRestaurantCapacity,
  updateRestaurantCapacity,
  createRestaurantCapacity,
} = require("../../controllers/restaurants/seatsCapacity");

///////////////////  ENDPOINTS  ///////////////////
router.get("/:id/capacity", getRestaurantCapacity);
router.patch("/:id/capacity/:table_num", updateRestaurantCapacity);
router.put("/:id/capacity", createRestaurantCapacity);

module.exports = router;
