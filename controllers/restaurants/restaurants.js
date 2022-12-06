const db = require("../../db/db");

///////////////  GET ONE RESTAURANT  //////////////
const getOneRestaurant = async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM restaurants WHERE id = $1", [
      req.params.id,
    ]);
    console.log(results.rows);
    res.status(200).json({
      status: "retrieve one restaurant successful",
      result: results.rows[0].name,
      data: { restaurant: results.rows[0] },
    });
  } catch (error) {
    console.log("POST /api/restaurants/:id", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when retrieving restaurant profile",
      });
    }
  }
};

///////////////  UPDATE RESTAURANT  ///////////////
const updateRestaurant = async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE restaurants SET name = $1, address_line_1 = $2, address_line_2 = $3, country = $4, postal_code = $5, website = $6, tel = $7, in_operation = $8 WHERE id = $9 RETURNING *",
      [
        req.body.name,
        req.body.address_line_1,
        req.body.address_line_2,
        req.body.country,
        req.body.postal_code,
        req.body.website,
        req.body.tel,
        req.body.in_operation,
        req.params.id,
      ]
    );
    console.log(results.rows);
    res.status(200).json({
      status: "update successful",
      result: results.rows[0].name,
      data: { restaurant: results.rows[0] },
    });
  } catch (error) {
    console.log("PATCH /api/restaurants/:id", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when updating restaurant profile",
      });
    }
  }
};

///////////////  CREATE RESTAURANT  ///////////////
const createRestaurant = async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO restaurants (name, address_line_1, address_line_2, country, postal_code, website, tel) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        req.body.name,
        req.body.address_line_1,
        req.body.address_line_2,
        req.body.country,
        req.body.postal_code,
        req.body.website,
        req.body.tel,
      ]
    );
    res.status(200).json({
      status: "create successful",
      data: { restaurant: results.rows[0] },
    });
  } catch (error) {
    console.log("PUT /api/restaurants", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when creating restaurant profile",
      });
    }
  }
};

///////////////  GET ALL RESTAURANT  //////////////
const getAllRestaurants = async (req, res) => {
  try {
    if (!req.body.searchInput) {
      const results = await db.query(
        "SELECT * FROM restaurants FULL JOIN restaurant_locations on restaurants.id = restaurant_locations.restaurant_id FULL JOIN restaurant_cuisines on restaurants.id = restaurant_cuisines.restaurant_id FULL JOIN restaurant_operating_hours on restaurants.id = restaurant_operating_hours.restaurant_id FULL JOIN restaurant_tags on restaurants.id = restaurant_tags.restaurant_id LIMIT 12"
      );
      console.log(results.rows);
      res.status(200).json({
        status: "retrieve all restaurants successful",
        total_results: results.rows.length,
        data: {
          restaurants: results.rows,
        },
      });
    } else {
      const results = await db.query(
        "SELECT * FROM restaurants FULL JOIN restaurant_locations on restaurants.id = restaurant_locations.restaurant_id FULL JOIN restaurant_cuisines on restaurants.id = restaurant_cuisines.restaurant_id FULL JOIN restaurant_operating_hours on restaurants.id = restaurant_operating_hours.restaurant_id FULL JOIN restaurant_tags on restaurants.id = restaurant_tags.restaurant_id WHERE (restaurants.name ILIKE $1) OR (restaurants.building_name ILIKE $1) OR (restaurant_locations.location_id ILIKE $1)",
        [`%${req.body.searchInput}%`]
      );
      console.log(results.rows);
      res.status(200).json({
        status: "retrieve all restaurants successful",
        total_results: results.rows.length,
        data: {
          restaurants: results.rows,
        },
      });
    }
  } catch (error) {
    console.log("GET /api/restaurants", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when retrieving restaurants listing",
      });
    }
  }
};

module.exports = {
  getOneRestaurant,
  updateRestaurant,
  createRestaurant,
  getAllRestaurants,
};
