const db = require("../../db/db");
const bcrypt = require("bcrypt");

//////////////////  LOGIN STAFF  ///////////////////
const login = async (req, res) => {
  try {
    // Find user with the email
    const findStaff = await db.query(
      "SELECT EXISTS (SELECT email FROM restaurant_staff WHERE email = $1)",
      [req.body.email]
    );

    // Storing result returned into another variable
    const staff = findStaff.rows[0].exists;

    console.log("staff:", staff);

    if (!staff) {
      return res
        .status(401)
        .json({ status: "error", message: "not authorised" });
    }

    if (staff) {
      const staffInfo = await db.query(
        "SELECT * FROM restaurant_staff WHERE email = $1",
        [req.body.email]
      );

      console.log(staffInfo.rows);

      if (!staffInfo.rows[0].resigned) {
        const validPassword = await bcrypt.compare(
          req.body.password,
          staffInfo.rows[0].password
        ); // parse in 2 things, if matched will return true. Order here is important.
        console.log(`yay`);
        if (!validPassword) {
          console.log("username or password error");
          return res
            .status(401)
            .json({ status: "error", message: "login failed" });
        } else {
          console.log(`login OK`);
          return res
            .status(200)
            .json({ status: "successful", data: staffInfo.rows[0] });
        }
      } else {
        return res
          .status(401)
          .json({ status: "error", message: "account does not exist" });
      }
    }
  } catch (error) {
    console.log("POST /api/restaurants/staff/login", error);
    res.status(400).json({ status: "error", message: "login failed" });
  }
};

/////////////////  GET ONE STAFF  /////////////////
const getOneStaff = async (req, res) => {
  try {
    const results = await db.query(
      "SELECT restaurant_staff.id, username, restaurant_staff.name, last_name, email, role, resigned FROM restaurant_staff where restaurant_id = $1 AND restaurant_staff.id = $2",
      [req.params.id, req.body.staff_id]
    );
    console.log(results.rows);
    res.status(200).json({
      status: "retrieve staff profile successful",
      result: results.rows[0].name + " " + results.rows[0].last_name,
      data: { staff: results.rows[0] },
    });
  } catch (error) {
    console.log("POST /api/restaurants/:id/staff", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when retrieving staff profile",
      });
    }
  }
};

/////////////////  UPDATE STAFF  //////////////////
const updateStaff = async (req, res) => {
  console.log("update data", req.body);
  console.log(req.body.name);
  try {
    const results = await db.query(
      "UPDATE restaurant_staff SET username = $1, name = $2, last_name = $3, email = $4, role = $5, resigned = $6 WHERE restaurant_id = $7 AND id = $8 RETURNING id, username, name, last_name, email, role, resigned",
      [
        req.body.username,
        req.body.name,
        req.body.last_name,
        req.body.email,
        req.body.role,
        req.body.resigned,
        req.params.id,
        req.body.id,
      ]
    );
    console.log(results.rows);
    res.status(200).json({
      status: "update successful",
      results: results.rows[0].name + " " + results.rows[0].last_name,
      data: { staff: results.rows[0] },
    });
  } catch (error) {
    console.log("PATCH /api/restaurants/:id/staff/update", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when updating staff profile",
      });
    }
  }
};

/////////////////  DELETE STAFF  //////////////////
const deleteStaff = async (req, res) => {
  try {
    const results = await db.query(
      "DELETE FROM restaurant_staff WHERE id = $1 AND restaurant_id = $2",
      [req.body.staff_id, req.params.id]
    );
    console.log(results.rows);
    res.status(200).json({
      status: "delete successful",
    });
  } catch (error) {
    console.log("DELETE /api/restaurants/:id/staff/delete", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when deleting a staff profile",
      });
    }
  }
};

/////////  CREATE FIRST MANAGER ACCOUNT  //////////
const createFirstManager = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 12);
    const results = await db.query(
      "INSERT INTO restaurant_staff (username, name, last_name, email, password, role, restaurant_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        req.body.username,
        req.body.name,
        req.body.last_name,
        req.body.email,
        hash,
        req.body.role,
        req.body.id,
      ]
    );
    console.log(results.rows);
    console.log(req.params.id);
    res.status(200).json({
      status: "create successful",
      data: { staff: results.rows[0] },
    });
  } catch (error) {
    console.log("PUT /api/restaurants/first-manager", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when creating a staff profile",
      });
    }
  }
};

/////////////////  CREATE STAFF  //////////////////
const createStaff = async (req, res) => {
  try {
    // Check if there s a duplicate username
    const checkUsername = await db.query(
      "SELECT EXISTS (SELECT username FROM restaurant_staff WHERE username = $1 AND restaurant_id = $2)",
      [req.body.username, req.params.id]
    );

    // Storing result returned from username query into another variable
    const duplicatedUsername = checkUsername.rows[0].exists;
    console.log(req.params);
    // If username does not exist in database, account will be created
    if (!duplicatedUsername) {
      const hash = await bcrypt.hash(req.body.password, 12);
      const results = await db.query(
        "INSERT INTO restaurant_staff (username, name, last_name, email, password, role, restaurant_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [
          req.body.username,
          req.body.name,
          req.body.last_name,
          req.body.email,
          hash,
          req.body.role,
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
    console.log("PUT /api/restaurants/:id/staff/create", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when creating a staff profile",
      });
    }
  }
};

/////////////////  GET ALL STAFF  /////////////////
const getAllStaff = async (req, res) => {
  try {
    const results = await db.query(
      "SELECT id, username, name, last_name, email, role, resigned FROM restaurant_staff WHERE restaurant_id = $1 ORDER BY id DESC",
      [req.params.id]
    );
    console.log(results.rows);
    res.status(200).json({
      status: "retrieve all staff successful",
      total_results: results.rows.length,
      data: {
        restaurant_staff: results.rows,
      },
    });
  } catch (error) {
    console.log("GET /api/restaurants", error);
    if (error) {
      res.status(400).json({
        status: "error",
        message: "an error has occurred when retrieving staff listing",
      });
    }
  }
};

module.exports = {
  getOneStaff,
  updateStaff,
  deleteStaff,
  createStaff,
  getAllStaff,
  createFirstManager,
  login,
};
