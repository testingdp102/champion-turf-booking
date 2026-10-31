const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is missing in .env"
  );
}

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !mobile ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users
      (name,email,mobile,password)
      VALUES ($1,$2,$3,$4)
      RETURNING id,name,email,mobile
      `,
      [
        name,
        email,
        mobile,
        hashedPassword,
      ]
    );

    const user = result.rows[0];

    const token = generateToken(user);

    res.status(201).json({
      message: "Registration successful",
      token,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { mobile, password } =
      req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        message:
          "Mobile number and password are required",
      });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE mobile = $1",
      [mobile]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message:
          "Invalid mobile number or password",
      });
    }

    const user = result.rows[0];

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        message:
          "Invalid mobile number or password",
      });
    }

    const token = generateToken(user);

    res.json({
      message: "Login Successful",
      token,
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
      message: "Server error",
    });
  }
};

module.exports = {
  register,
  login,
};