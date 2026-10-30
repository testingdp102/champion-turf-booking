const pool = require("../config/db");

const getDashboardSummary = async (req, res) => {
  try {
    const totalUsers = await pool.query(
      "SELECT COUNT(*) FROM users"
    );

    const totalBookings = await pool.query(
      "SELECT COUNT(*) FROM bookings"
    );

    const totalRevenue = await pool.query(
      `SELECT COALESCE(SUM(total_amount),0)
       FROM bookings
       WHERE status='Booked'`
    );

    const cancelledBookings = await pool.query(
      `SELECT COUNT(*)
       FROM bookings
       WHERE status='Cancelled'`
    );

    res.json({
      turfName: "Champion Turf",
      location: "Jodhpur",
      totalUsers: totalUsers.rows[0].count,
      totalBookings: totalBookings.rows[0].count,
      totalRevenue: totalRevenue.rows[0].coalesce,
      cancelledBookings: cancelledBookings.rows[0].count
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  getDashboardSummary
};