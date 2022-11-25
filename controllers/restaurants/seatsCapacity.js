const db = require("../../db/db");

///////////  GET RESTAURANT CAPACITY  /////////////
const getRestaurantCapacity = async (req, res) => {
  try {
    const results = await db.query(
      "SELECT table_num, table_capacity, table_occupied FROM restaurant_seats_capacity WHERE restaurant_id = $1 ORDER BY table_num::int ASC",
      [req.params.id]
    );
    console.log(results.rows);

    const capacity = await db.query(
      "SELECT SUM(table_capacity::int) as max_capacity FROM restaurant_seats_capacity WHERE restaurant_id = $1",
      [req.params.id]
    );

    const unoccupied = await db.query(
      "SELECT SUM(table_capacity::int) as empty_seats FROM restaurant_seats_capacity WHERE restaurant_id = $1 AND table_occupied = false;",
      [req.params.id]
    );

    res.status(200).json({
      status: "retrieve restaurant seating capacity successful",
      total_tables: results.rows.length,
      data: {
        tables: results.rows,
        max_capacity: capacity.rows[0].max_capacity,
        seats_available: unoccupied.rows[0].empty_seats,
      },
    });
  } catch (error) {
    console.log("GET /api/restaurants/:id/capacity", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message:
          "an error has occurred when retrieving restaurant seating capacity",
      });
    }
  }
};

//////////  UPDATE RESTAURANT CAPACITY  ///////////
const updateRestaurantCapacity = async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE restaurant_seats_capacity SET table_occupied = $1 WHERE restaurant_id = $2 AND restaurant_seats_capacity.table_num = $3 RETURNING table_num, table_capacity, table_occupied",
      [req.body.table_occupied, req.params.id, req.body.table_num]
    );
    res.status(200).json({
      status: "update successful",
      remarks: results.rows[0].table_occupied
        ? "Table " + results.rows[0].table_num + " is now occupied"
        : "Table " + results.rows[0].table_num + " is now vacant",
      data: { table: results.rows[0] },
    });
  } catch (error) {
    console.log("PATCH /api/restaurants/:id/capacity", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred",
      });
    }
  }
};

//////////  DELETE RESTAURANT CAPACITY  ///////////
const deleteRestaurantCapacity = async (req, res) => {
  try {
    const results = await db.query(
      "DELETE FROM restaurant_seats_capacity WHERE table_num = $1 AND restaurant_id = $2",
      [req.body.table_num, req.params.id]
    );
    console.log(results.rows);
    res.status(200).json({
      status: "delete successful",
    });
  } catch (error) {
    console.log("DELETE /api/restaurants/:id/capacity", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when deleting a staff profile",
      });
    }
  }
};

//////////  CREATE RESTAURANT CAPACITY  ///////////
const createRestaurantCapacity = async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO restaurant_seats_capacity (table_num, table_capacity, restaurant_id) VALUES ($1, $2, $3) RETURNING *",
      [req.body.table_num, req.body.table_capacity, req.params.id]
    );
    res.status(200).json({
      status: "create successful",
      total_tables: results.rows.length,
      data: { tables: results.rows },
    });
  } catch (error) {
    console.log("PUT /api/restaurants/:id/capacity", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred",
      });
    }
  }
};

module.exports = {
  getRestaurantCapacity,
  updateRestaurantCapacity,
  deleteRestaurantCapacity,
  createRestaurantCapacity,
};
