const db = require("../../db/db");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { v4: uuidv4 } = require("uuid");

// //////////////////  LOGIN USER (JWT) ///////////////////
// const login = async (req, res) => {
//   try {
//     // Find user with the email
//     const findUser = await db.query(
//       "SELECT EXISTS (SELECT email FROM users WHERE email = $1)",
//       [req.body.email]
//     );

//     // Storing result returned into another variable
//     const user = findUser.rows[0].exists;

//     console.log("user:", user);

//     if (!user) {
//       return res
//         .status(401)
//         .json({ status: "error", message: "not authorised" });
//     }

//     if (user) {
//       const userInfo = await db.query("SELECT * FROM users WHERE email = $1", [
//         req.body.email,
//       ]);

//       console.log(userInfo.rows);

//       const validPassword = await bcrypt.compare(
//         req.body.password,
//         userInfo.rows[0].password
//       ); // parse in 2 things, if matched will return true. Order here is important.

//       if (!validPassword) {
//         console.log("username or password error");
//         return res
//           .status(401)
//           .json({ status: "error", message: "login failed" });
//       } else {
//         const payload = {
//           id: userInfo.rows[0].id,
//           email: userInfo.rows[0].email,
//         };

//         const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
//           expiresIn: "20m",
//           jwtid: uuidv4(),
//         });

//         const refresh = jwt.sign(payload, process.env.REFRESH_SECRET, {
//           expiresIn: "30d",
//           jwtid: uuidv4(),
//         });

//         const response = {
//           access,
//           refresh,
//         };

//         return res.status(200).json({ status: "successful", response });
//       }
//     }
//   } catch (error) {
//     console.log("POST /api/users/login", error);
//     res.status(400).json({ status: "error", message: "login failed" });
//   }
// };

// ///////////////////  REFRESH  /////////////////////
// const refresh = (req, res) => {
//   try {
//     const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);

//     console.log(decoded);

//     const payload = {
//       id: decoded.id, // creating the same payload on top
//       email: decoded.email,
//     };

//     const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
//       expiresIn: "20m",
//       jwtid: uuidv4(), // for the creation of jti (within jwt's payload section) - helps to link refresh and access tokens
//     });

//     const response = {
//       access,
//     };

//     res.json(response);
//   } catch (error) {
//     console.log("POST /api/users/refresh", error);
//     res.status(401).json({
//       status: "error",
//       message: "not authorised",
//     });
//   }
// };

//////////////////  LOGIN USER  ///////////////////
const login = async (req, res) => {
  try {
    // Find user with the email
    const findUser = await db.query(
      "SELECT EXISTS (SELECT email FROM users WHERE email = $1)",
      [req.body.email]
    );

    // Storing result returned into another variable
    const user = findUser.rows[0].exists;

    console.log("user:", user);

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "not authorised" });
    }

    if (user) {
      const userInfo = await db.query("SELECT * FROM users WHERE email = $1", [
        req.body.email,
      ]);

      console.log(userInfo.rows);

      const validPassword = await bcrypt.compare(
        req.body.password,
        userInfo.rows[0].password
      ); // parse in 2 things, if matched will return true. Order here is important.

      if (!validPassword) {
        console.log("username or password error");
        return res
          .status(401)
          .json({ status: "error", message: "login failed" });
      } else {
        return res
          .status(200)
          .json({ status: "successful", data: userInfo.rows[0] });
      }
    }
  } catch (error) {
    console.log("POST /api/users/login", error);
    res.status(400).json({ status: "error", message: "login failed" });
  }
};

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

    console.log(checkEmail.rows);

    // Storing result returned from user email query into another variable
    const duplicatedEmail = checkEmail.rows[0].exists;

    // If user does not exist in database, account will be created
    if (!duplicatedEmail) {
      const hash = await bcrypt.hash(req.body.password, 12);
      const newUser = await db.query(
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

      res.status(200).json({
        status: "create successful",
        data: { user: newUser.rows[0] },
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "account exist",
      });
    }
  } catch (error) {
    console.log("PUT /api/users/register", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred",
      });
    }
  }
};

/////////////////  GET ALL USERS //////////////////
const getAllUsers = async (req, res) => {
  try {
    const results = await db.query(
      "SELECT id, username, name, last_name, email, account_active FROM users"
    );

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
  login,
};
