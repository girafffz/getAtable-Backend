require("dotenv").config();

const express = require("express");
const cors = require("cors");

const restaurants = require("./routers/restaurants/restaurants");
const staff = require("./routers/restaurants/staff");

///////////////  Variables defined  ///////////////
const app = express();
const PORT = process.env.PORT || 5001;

///////////////////  Middleware  //////////////////
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

////////////////////  ROUTES  /////////////////////
app.use("/api/restaurants", restaurants);
app.use("/api/restaurants", staff);

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
///////////  RESTAURANT SEATS CAPACITY  ///////////
///////////////////////////////////////////////////

// Get seats capacity (to fetch whenever there is a change in status, assumptions: no sharing of tables with different groups of people)
app.get("/api/restaurants/:id/capacity", async (req, res) => {
  try {
    const results = await db.query(
      "SELECT table_num, table_capacity, table_occupied FROM restaurant_seats_capacity WHERE restaurant_id = $1",
      [req.params.id]
    );
    console.log(results.rows);

    res.status(200).json({
      status: "retrieve restaurant seating capacity successful",
      total_tables: results.rows.length,
      data: { tables: results.rows },
    });
  } catch (error) {
    console.log("GET /api/restaurants", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message:
          "an error has occurred when retrieving restaurant seating capacity",
      });
    }
  }
});

// Create seats capacity
app.put("/api/restaurants/:id/capacity", async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO restaurant_seats_capacity (table_num, table_capacity, table_occupied, restaurant_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        req.body.table_num,
        req.body.table_capacity,
        req.body.table_occupied,
        req.params.id,
      ]
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
});

// Update seats capacity
app.patch("/api/restaurants/:id/capacity/:table_num", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE restaurant_seats_capacity SET table_occupied = $1 WHERE restaurant_id = $2 AND restaurant_seats_capacity.table_num = $3 RETURNING table_num, table_capacity, table_occupied",
      [req.body.table_occupied, req.params.id, req.params.table_num]
    );
    res.status(200).json({
      status: "update successful",
      remarks: results.rows[0].table_occupied
        ? "Table " + results.rows[0].table_num + " is now occupied"
        : "Table " + results.rows[0].table_num + " is now vacant",
      data: { table: results.rows[0] },
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
});

///////////////////////////////////////////////////
/////////////////////  USERS  /////////////////////
///////////////////////////////////////////////////

// Get a user
app.post("/api/users/:user_id", async (req, res) => {
  try {
    const results = await db.query(
      "SELECT id, username, name, last_name, email, account_active FROM users where users.id = $1",
      [req.params.user_id]
    );
    console.log(results.rows);
    res.status(200).json({
      status: "retrieve user profile successful",
      result: results.rows[0].name + " " + results.rows[0].last_name,
      data: { user: results.rows[0] },
    });
  } catch (error) {
    console.log("POST /api/users/:user_id", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when retrieving user profile",
      });
    }
  }
});

// Update a user
app.patch("/api/users/:user_id", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE users SET username = $1, name = $2, last_name = $3, email = $4, account_active = $5 WHERE id = $6 RETURNING id, username, name, last_name, email, account_active",
      [
        req.body.username,
        req.body.name,
        req.body.last_name,
        req.body.email,
        req.body.account_active,
        req.params.user_id,
      ]
    );
    console.log(results.rows);
    res.status(200).json({
      status: "update successful",
      results: results.rows[0].name + " " + results.rows[0].last_name,
      data: { user: results.rows[0] },
    });
  } catch (error) {
    console.log("PATCH /api/users/:user_id", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when updating user profile",
      });
    }
  }
});

// Create a user
app.put("/api/users", async (req, res) => {
  try {
    // Check if user already has an account using email
    const checkEmail = await db.query(
      "SELECT EXISTS (SELECT email FROM users WHERE email = $1)",
      [req.body.email]
    );

    // Storing result returned from user email query into another variable
    const duplicatedEmail = checkEmail.rows[0].exists;

    // If user does not exist in database, account will be created
    if (!duplicatedEmail) {
      const hash = await bcrypt.hash(req.body.password, 12);
      const results = await db.query(
        "INSERT INTO users (username, name, last_name, email, password, account_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING username, name, last_name, email, account_active",
        [
          req.body.username,
          req.body.name,
          req.body.last_name,
          req.body.email,
          hash,
          req.body.account_active,
        ]
      );
      console.log(results.rows);
      res.status(200).json({
        status: "create successful",
        data: { user: results.rows[0] },
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "account exist",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const results = await db.query(
      "SELECT username, name, last_name, email, account_active FROM users"
    );
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
