require("dotenv").config();

const express = require("express");
const cors = require("cors");

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
app.post("/api/restaurants/:id", (req, res) => {
  console.log(req.params);
  res.status(200).json({
    status: "retrieve one successful",
  });
});

// Update a restaurant
app.patch("/api/restaurants/:id", (req, res) => {
  console.log(req.params);
  console.log(req.body);
  res.status(200).json({
    status: "update successful",
  });
});

// Create a restaurant
app.put("/api/restaurants", (req, res) => {
  console.log(req.body);
  res.status(200).json({
    status: "create successful",
  });
});

// Get all restaurants
app.get("/api/restaurants", (req, res) => {
  res.status(200).json({
    status: "retrieve all successful",
  });
});

///////////////////////////////////////////////////
////////////////  RESTAURANT STAFF  ///////////////
///////////////////////////////////////////////////

// Get a restaurant staff
app.post("/api/restaurants/:id/staff/:staff_id", (req, res) => {
  console.log(req.params);
  res.status(200).json({
    status: "retrieve one successful",
  });
});

// Update a restaurant staff
app.patch("/api/restaurants/:id/staff/:staff_id", (req, res) => {
  console.log(req.params);
  console.log(req.body);
  res.status(200).json({
    status: "update successful",
  });
});

// Delete a restaurant staff
app.delete("/api/restaurants/:id/staff/:staff_id", (req, res) => {
  console.log(req.params);
  console.log(req.body);
  res.status(200).json({
    status: "delete successful",
  });
});

// Create a restaurant staff
app.put("/api/restaurants/:id/staff", (req, res) => {
  console.log(req.body);
  res.status(200).json({
    status: "create successful",
  });
});

// Get all restaurant staff
app.get("/api/restaurants/:id/staff", (req, res) => {
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
app.get("/api/users", (req, res) => {
  res.status(200).json({
    status: "retrieve all successful",
  });
});

app.listen(PORT, () =>
  console.log(`Server connected, now listening to ${PORT}`)
);
