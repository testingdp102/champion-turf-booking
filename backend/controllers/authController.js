const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// Register
const register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

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
        message: "Email or Mobile Number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
      [name, email, mobile, hashedPassword]
    );

    // Welcome Email
    try {
      await sendEmail(
        result.rows[0].email,
        "Welcome to Champion Turf",
        `Hello ${result.rows[0].name},

Your Champion Turf account has been created successfully.

You can now log in and start booking turfs.

Regards,
Champion Turf Team`
      );
    } catch (emailError) {
      console.error(
        "Welcome Email Error:",
        emailError.message
      );
    }

    res.status(201).json({
      message: "User Registered Successfully",
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
    const { mobile, password } = req.body;

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE mobile = $1
      `,
      [mobile]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid Mobile Number",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(
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
      process.env.JWT_SECRET || "champion_turf_secret",
      {
        expiresIn: "1d",
      }
    );

    // Login Alert Email
    try {
      await sendEmail(
        user.email,
        "Champion Turf Login Alert",
        `Hello ${user.name},

You have successfully logged in to Champion Turf.

Login Time:
${new Date().toLocaleString()}

If this login was not performed by you,
please reset your password immediately.

Regards,
Champion Turf Team`
      );
    } catch (emailError) {
      console.error(
        "Login Email Error:",
        emailError.message
      );
    }

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