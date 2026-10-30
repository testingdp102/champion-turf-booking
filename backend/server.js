const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/dashboard", dashboardRoutes);

pool.query("SELECT NOW()", (err) => {
  if (err) {
    console.log("Database Error:", err);
  } else {
    console.log("✅ PostgreSQL Connected");
  }
});

app.get("/", (req, res) => {
  res.send("Turf Booking API Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});