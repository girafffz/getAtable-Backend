require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db/db");

///////////////  Variables defined  ///////////////
const app = express();
const PORT = process.env.PORT || 5001;

///////////////////  Middleware  //////////////////
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

///////////////////////////////////////////////////
//////////////////  RESTAURANTS  //////////////////
///////////////////////////////////////////////////

// Get a restaurant
app.post("/api/restaurants/:id", async (req, res) => {
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
});

// Update a restaurant
app.patch("/api/restaurants/:id", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE restaurants SET name = $1, address_line_1 = $2, address_line_2 = $3, country = $4, postal_code = $5, website = $6, tel = $7, table_for_2 = $8, table_for_4 = $9, table_for_6 = $10, table_for_8 = $11, table_for_10 = $12, in_operation = $13 WHERE id = $14 RETURNING *",
      [
        req.body.name,
        req.body.address_line_1,
        req.body.address_line_2,
        req.body.country,
        req.body.postal_code,
        req.body.website,
        req.body.tel,
        req.body.table_for_2,
        req.body.table_for_4,
        req.body.table_for_6,
        req.body.table_for_8,
        req.body.table_for_10,
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
});

// Create a restaurant
app.put("/api/restaurants", async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO restaurants (name, address_line_1, address_line_2, country, postal_code, website, tel, table_for_2, table_for_4, table_for_6, table_for_8, table_for_10, in_operation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
      [
        req.body.name,
        req.body.address_line_1,
        req.body.address_line_2,
        req.body.country,
        req.body.postal_code,
        req.body.website,
        req.body.tel,
        req.body.table_for_2,
        req.body.table_for_4,
        req.body.table_for_6,
        req.body.table_for_8,
        req.body.table_for_10,
        req.body.in_operation,
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
});

// Get all restaurants
app.get("/api/restaurants", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM restaurants");
    console.log(results.rows);
    res.status(200).json({
      status: "retrieve all restaurants successful",
      total_results: results.rows.length,
      data: {
        restaurants: results.rows,
      },
    });
  } catch (error) {
    console.log("GET /api/restaurants", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when retrieving restaurants listing",
      });
    }
  }
});

///////////////////////////////////////////////////
////////////////  RESTAURANT STAFF  ///////////////
///////////////////////////////////////////////////

// Get a restaurant staff
app.post("/api/restaurants/:id/staff/:staff_id", async (req, res) => {
  try {
    const results = await db.query(
      "SELECT restaurant_staff.id, username, restaurant_staff.name, last_name, email, role, resigned FROM restaurant_staff where restaurant_id = $1 AND restaurant_staff.id = $2",
      [req.params.id, req.params.staff_id]
    );
    console.log(results.rows);
    res.status(200).json({
      status: "retrieve staff profile successful",
      result: results.rows[0].name + " " + results.rows[0].last_name,
      data: { staff: results.rows[0] },
    });
  } catch (error) {
    console.log("POST /api/restaurants/:id/staff/:staff_id", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when retrieving staff profile",
      });
    }
  }
});

// Update a restaurant staff
app.patch("/api/restaurants/:id/staff/:staff_id", async (req, res) => {
  try {
    const results = await db.query();
    console.log(req.params);
    console.log(results.rows);
    res.status(200).json({
      status: "update successful",
    });
  } catch (error) {
    console.log("PATCH /api/restaurants/:id/staff/:staff_id", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when updating staff profile",
      });
    }
  }
});

// Delete a restaurant staff
app.delete("/api/restaurants/:id/staff/:staff_id", async (req, res) => {
  try {
    const results = await db.query(
      "DELETE FROM restaurant_staff where id = $1 RETURNING *",
      [req.params.staff_id]
    );
    console.log(results.rows);
    res.status(200).json({
      status: "delete successful",
      data: { remaining_staff: results.rows },
    });
  } catch (error) {
    console.log("DELETE /api/restaurants/:id/staff/:staff_id", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when deleting a staff profile",
      });
    }
  }
});

// Create a restaurant staff
app.put("/api/restaurants/:id/staff", async (req, res) => {
  try {
    // Check if there s a duplicate username
    const duplicateUsername = await db.query(
      "SELECT * FROM restaurant_staff WHERE username = $1",
      [req.body.username]
    );

    // If username does not exist in database, account will be created
    if (!duplicateUsername) {
      const hash = await bcrypt.hash(req.body.password, 12);
      const results = await db.query(
        "INSERT INTO restaurant_staff (username, name, last_name, email, password, role, resigned, restaurant_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [
          req.body.username,
          req.body.name,
          req.body.last_name,
          req.body.email,
          hash,
          req.body.role,
          req.body.resigned,
          req.params.id,
        ]
      );
      console.log(results.rows);
      console.log(req.params.id);
      res.status(200).json({
        status: "create successful",
        data: { staff: results.rows[0] },
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "duplicate username",
      });
    }
  } catch (error) {
    console.log("PUT /api/restaurants/:id/staff", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when creating a staff profile",
      });
    }
  }
});

// Get all restaurant staff
app.get("/api/restaurants/:id/staff", (req, res) => {
  console.log(req.body);
  res.status(200).json({
    status: "retrieve all successful",
  });
});

///////////////////////////////////////////////////
//////////////  RESTAURANT REVIEWS  ///////////////
///////////////////////////////////////////////////

// Get a restaurant review
app.post("/api/restaurants/:id/reviews/:review_id", (req, res) => {
  console.log(req.params);
  res.status(200).json({
    status: "retrieve one successful",
  });
});

// Update a restaurant review
app.patch("/api/restaurants/:id/reviews/:review_id", (req, res) => {
  console.log(req.params);
  console.log(req.body);
  res.status(200).json({
    status: "update successful",
  });
});

// Delete a restaurant review
app.delete("/api/restaurants/:id/reviews/:review_id", (req, res) => {
  console.log(req.params);
  console.log(req.body);
  res.status(200).json({
    status: "delete successful",
  });
});

// Create a restaurant review
app.put("/api/restaurants/:id/reviews", (req, res) => {
  console.log(req.body);
  res.status(200).json({
    status: "create successful",
  });
});

// Get all restaurant reviews
app.get("/api/restaurants/:id/reviews", (req, res) => {
  res.status(200).json({
    status: "retrieve all successful",
  });
});

///////////////////////////////////////////////////
/////////////////////  USERS  /////////////////////
///////////////////////////////////////////////////

// Get a user
app.post("/api/users/:user_id", (req, res) => {
  console.log(req.params);
  res.status(200).json({
    status: "retrieve one successful",
  });
});

// Update a user
app.patch("/api/users/:user_id", (req, res) => {
  console.log(req.params);
  console.log(req.body);
  res.status(200).json({
    status: "update successful",
  });
});

// Create a user
app.put("/api/users", (req, res) => {
  console.log(req.body);
  res.status(200).json({
    status: "create successful",
  });
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM users");
    console.log(results.rows);
    res.status(200).json({
      status: "retrieve all users successful",
      total_results: results.rows.length,
      data: {
        users: results.rows,
      },
    });
  } catch (error) {
    console.log("GET /api/users", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when retrieving users listing",
      });
    }
  }
});

app.listen(PORT, () =>
  console.log(`Server connected, now listening to ${PORT}`)
);
