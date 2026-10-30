const pool = require("../config/db");

// Create Booking
const createBooking = async (req, res) => {
  try {
    const {
      user_id,
      booking_date,
      start_time,
      end_time,
    } = req.body;

    // Validation
    if (
      !user_id ||
      !booking_date ||
      !start_time ||
      !end_time
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Time Validation
    if (start_time >= end_time) {
      return res.status(400).json({
        message:
          "End time must be greater than start time",
      });
    }

    // Verify User Exists
    const userCheck = await pool.query(
      `
      SELECT *
      FROM users
      WHERE id = $1
      `,
      [user_id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Duplicate Booking Check
    const duplicateBooking =
      await pool.query(
        `
        SELECT *
        FROM bookings
        WHERE user_id = $1
        AND booking_date = $2
        AND start_time = $3
        AND end_time = $4
        AND status = 'Booked'
        `,
        [
          user_id,
          booking_date,
          start_time,
          end_time,
        ]
      );

    if (duplicateBooking.rows.length > 0) {
      return res.status(400).json({
        message:
          "This booking already exists.",
      });
    }

    // Slot Availability Check
    const existingBooking =
      await pool.query(
        `
        SELECT *
        FROM bookings
        WHERE booking_date = $1
        AND status = 'Booked'
        AND
        (
          start_time < $2
          AND end_time > $3
        )
        `,
        [
          booking_date,
          end_time,
          start_time,
        ]
      );

    if (existingBooking.rows.length > 0) {
      return res.status(400).json({
        message:
          "Slot already booked. Please choose another slot.",
      });
    }

    // Calculate Booking Amount
    const startHour = Number(
      start_time.split(":")[0]
    );

    const endHour = Number(
      end_time.split(":")[0]
    );

    const totalHours =
      endHour - startHour;

    const totalAmount =
      totalHours * 1000;

    // Insert Booking
    const result = await pool.query(
      `
      INSERT INTO bookings
      (
        user_id,
        booking_date,
        start_time,
        end_time,
        total_amount,
        status
      )
      VALUES
      ($1,$2,$3,$4,$5,'Booked')
      RETURNING *
      `,
      [
        user_id,
        booking_date,
        start_time,
        end_time,
        totalAmount,
      ]
    );

    res.status(201).json({
      message:
        "Booking Created Successfully",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Booking Error:",
      error
    );

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get User Bookings
const getUserBookings = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM bookings
      WHERE user_id = $1
      ORDER BY booking_date DESC
      `,
      [userId]
    );

    res.status(200).json(
      result.rows
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Cancel Booking
const cancelBooking = async (
  req,
  res
) => {
  try {
    const { bookingId } = req.params;

    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        message:
          "Cancellation reason is required",
      });
    }

    // Check Booking Exists
    const booking = await pool.query(
      `
      SELECT *
      FROM bookings
      WHERE id = $1
      `,
      [bookingId]
    );

    if (booking.rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Prevent Duplicate Cancellation
    if (
      booking.rows[0].status ===
      "Cancelled"
    ) {
      return res.status(400).json({
        message:
          "Booking is already cancelled",
      });
    }

    // Cancel Booking
    const result = await pool.query(
      `
      UPDATE bookings
      SET
        status = 'Cancelled',
        cancellation_reason = $1,
        cancelled_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [reason, bookingId]
    );

    res.status(200).json({
      message:
        "Booking Cancelled Successfully",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Dashboard Stats
const getDashboard = async (
  req,
  res
) => {
  try {
    const totalBookings =
      await pool.query(
        `
        SELECT COUNT(*)
        FROM bookings
        `
      );

    const totalRevenue =
      await pool.query(
        `
        SELECT
        COALESCE(
          SUM(total_amount),
          0
        ) AS revenue
        FROM bookings
        WHERE status = 'Booked'
        `
      );

    const cancelledBookings =
      await pool.query(
        `
        SELECT COUNT(*)
        FROM bookings
        WHERE status = 'Cancelled'
        `
      );

    res.status(200).json({
      totalBookings:
        totalBookings.rows[0].count,

      totalRevenue:
        totalRevenue.rows[0].revenue,

      cancelledBookings:
        cancelledBookings.rows[0].count,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking,
  getDashboard,
};