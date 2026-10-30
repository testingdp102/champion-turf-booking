const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
    } = req.body;

    const userExists = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      OR mobile = $2
      `,
      [email, mobile]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        message:
          "Email or Mobile Number already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users
      (
        name,
        email,
        mobile,
        password
      )
      VALUES
      ($1,$2,$3,$4)
      RETURNING
      id,
      name,
      email,
      mobile
      `,
      [
        name,
        email,
        mobile,
        hashedPassword,
      ]
    );

    res.status(201).json({
      message:
        "User Registered Successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { mobile, password } =
      req.body;

    console.log("Login Request:");
    console.log(req.body);

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE mobile = $1
      `,
      [mobile]
    );

    console.log(
      "Users Found:",
      result.rows
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message:
          "Invalid Mobile Number",
      });
    }

    const user = result.rows[0];

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET ||
        "champion_turf_secret",
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      userId: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  register,
  login,
};