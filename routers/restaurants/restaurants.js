const express = require("express");
const router = express.Router();

const {
  getOneRestaurant,
  updateRestaurant,
  createRestaurant,
  getAllRestaurants,
} = require("../../controllers/restaurants/restaurants");

///////////////////  ENDPOINTS  ///////////////////
router.post("/:id", getOneRestaurant);
router.patch("/:id", updateRestaurant);
router.put("/", createRestaurant);
router.post("/", getAllRestaurants);
router.get("/", getAllRestaurants);

module.exports = router;
