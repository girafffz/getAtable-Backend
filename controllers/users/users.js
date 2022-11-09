const db = require("../../db/db");
const bcrypt = require("bcrypt");

/////////////////  GET ONE USER  //////////////////
const getOneUser = async (req, res) => {
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
};

//////////////////  UPDATE USER  //////////////////
const updateUser = async (req, res) => {
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
};

//////////////////  CREATE USER  //////////////////
const createUser = async (req, res) => {
  try {
    // Check if user already has an account by using email
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
        "INSERT INTO users (username, name, last_name, email, password, account_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, name, last_name, email, account_active",
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
};

/////////////////  GET ALL USERS //////////////////
const getAllUsers = async (req, res) => {
  try {
    const results = await db.query(
      "SELECT id, username, name, last_name, email, account_active FROM users"
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
};

module.exports = {
  getOneUser,
  updateUser,
  createUser,
  getAllUsers,
};
