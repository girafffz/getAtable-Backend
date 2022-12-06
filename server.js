require("dotenv").config();

const express = require("express");
const cors = require("cors");

const restaurants = require("./routers/restaurants/restaurants");
const staff = require("./routers/restaurants/staff");
const seatsCapacity = require("./routers/restaurants/seatsCapacity");
const users = require("./routers/users/user");

///////////////  Variables defined  ///////////////
const app = express();
const PORT = process.env.PORT || 5001;

///////////////////  Middleware  //////////////////
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

////////////////////  ROUTES  /////////////////////
app.use("/api/restaurants", seatsCapacity);
app.use("/api/restaurants", restaurants);
app.use("/api/restaurants", staff);
app.use("/api/users", users);

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

app.listen(PORT, () =>
  console.log(`Server connected, now listening to ${PORT}`)
);
