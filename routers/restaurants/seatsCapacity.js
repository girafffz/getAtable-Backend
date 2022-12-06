const express = require("express");
const router = express.Router();

const {
  getRestaurantCapacity,
  searchRestaurantCapacity,
  updateRestaurantCapacity,
  deleteRestaurantCapacity,
  createRestaurantCapacity,
} = require("../../controllers/restaurants/seatsCapacity");

///////////////////  ENDPOINTS  ///////////////////
router.get("/:id/capacity", getRestaurantCapacity);
router.patch("/:id/capacity", updateRestaurantCapacity);
router.delete("/:id/capacity", deleteRestaurantCapacity);
router.put("/:id/capacity", createRestaurantCapacity);
router.post("/capacity", searchRestaurantCapacity);

module.exports = router;
