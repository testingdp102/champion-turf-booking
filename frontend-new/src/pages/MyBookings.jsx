import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCancelModal, setShowCancelModal] =
    useState(false);

  const [selectedBookingId, setSelectedBookingId] =
    useState(null);

  const [cancelReason, setCancelReason] =
    useState("");

  const [customReason, setCustomReason] =
    useState("");

  const fetchBookings = async () => {
    try {
      const userId =
        localStorage.getItem("userId");

      const response = await API.get(
        `/bookings/${userId}`
      );

      setBookings(response.data);
    } catch (error) {
      console.error(error);
      alert("Unable to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openCancelModal = (
    bookingId
  ) => {
    setSelectedBookingId(
      bookingId
    );

    setCancelReason("");
    setCustomReason("");

    setShowCancelModal(true);
  };

  const confirmCancelBooking =
    async () => {
      if (!cancelReason) {
        alert(
          "Please select a cancellation reason"
        );
        return;
      }

      const finalReason =
        cancelReason === "Other"
          ? customReason
          : cancelReason;

      if (!finalReason) {
        alert(
          "Please enter cancellation reason"
        );
        return;
      }

      try {
        const response =
          await API.put(
            `/bookings/cancel/${selectedBookingId}`,
            {
              reason: finalReason,
            }
          );

        alert(
          response.data.message
        );

        setShowCancelModal(false);

        fetchBookings();
      } catch (error) {
        alert(
          error?.response?.data
            ?.message ||
            "Unable to cancel booking"
        );
      }
    };

  const activeBookings =
    bookings.filter(
      (booking) =>
        booking.status === "Booked"
    );

  const cancelledBookings =
    bookings.filter(
      (booking) =>
        booking.status === "Cancelled"
    );

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary"></div>

        <h5 className="mt-3">
          Loading Bookings...
        </h5>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Bookings</h1>

        <button
          className="btn btn-secondary"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Back
        </button>
      </div>

      {/* Active Bookings */}

      <h3 className="text-success mb-3">
        Active Bookings
      </h3>

      {activeBookings.length === 0 ? (
        <div className="alert alert-info">
          No Active Bookings
        </div>
      ) : (
        activeBookings.map(
          (booking) => (
            <div
              key={booking.id}
              className="card mb-3 shadow-sm"
            >
              <div className="card-body">

                <p>
                  <strong>Date:</strong>{" "}
                  {booking.booking_date?.split(
                    "T"
                  )[0]}
                </p>

                <p>
                  <strong>Start:</strong>{" "}
                  {booking.start_time}
                </p>

                <p>
                  <strong>End:</strong>{" "}
                  {booking.end_time}
                </p>

                <p>
                  <strong>Amount:</strong>{" "}
                  ₹{booking.total_amount}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-success">
                    Booked
                  </span>
                </p>

                <button
                  className="btn btn-danger"
                  onClick={() =>
                    openCancelModal(
                      booking.id
                    )
                  }
                >
                  Cancel Booking
                </button>

              </div>
            </div>
          )
        )
      )}

      <hr className="my-5" />

      {/* Cancelled Bookings */}

      <h3 className="text-danger mb-3">
        Cancelled Bookings
      </h3>

      {cancelledBookings.length === 0 ? (
        <div className="alert alert-warning">
          No Cancelled Bookings
        </div>
      ) : (
        cancelledBookings.map(
          (booking) => (
            <div
              key={booking.id}
              className="card mb-3 border-danger"
            >
              <div className="card-body">

                <p>
                  <strong>Date:</strong>{" "}
                  {booking.booking_date?.split(
                    "T"
                  )[0]}
                </p>

                <p>
                  <strong>Start:</strong>{" "}
                  {booking.start_time}
                </p>

                <p>
                  <strong>End:</strong>{" "}
                  {booking.end_time}
                </p>

                <p>
                  <strong>Amount:</strong>{" "}
                  ₹{booking.total_amount}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-danger">
                    Cancelled
                  </span>
                </p>

                <p>
                  <strong>
                    Cancellation Reason:
                  </strong>{" "}
                  {booking.cancellation_reason ||
                    "-"}
                </p>

                <p>
                  <strong>
                    Cancelled On:
                  </strong>{" "}
                  {booking.cancelled_at
                    ? new Date(
                        booking.cancelled_at
                      ).toLocaleString()
                    : "-"}
                </p>

              </div>
            </div>
          )
        )
      )}

      {/* Cancel Booking Modal */}

      {showCancelModal && (
        <div
          className="modal d-block"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  Cancel Booking
                </h5>
              </div>

              <div className="modal-body">

                <h6 className="mb-3">
                  Select Reason
                </h6>

                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="reason"
                    value="Change of plans"
                    checked={
                      cancelReason ===
                      "Change of plans"
                    }
                    onChange={(e) =>
                      setCancelReason(
                        e.target.value
                      )
                    }
                  />
                  <label className="form-check-label">
                    Change of plans
                  </label>
                </div>

                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="reason"
                    value="Weather issue"
                    checked={
                      cancelReason ===
                      "Weather issue"
                    }
                    onChange={(e) =>
                      setCancelReason(
                        e.target.value
                      )
                    }
                  />
                  <label className="form-check-label">
                    Weather issue
                  </label>
                </div>

                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="reason"
                    value="Wrong booking"
                    checked={
                      cancelReason ===
                      "Wrong booking"
                    }
                    onChange={(e) =>
                      setCancelReason(
                        e.target.value
                      )
                    }
                  />
                  <label className="form-check-label">
                    Wrong booking
                  </label>
                </div>

                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="reason"
                    value="Personal emergency"
                    checked={
                      cancelReason ===
                      "Personal emergency"
                    }
                    onChange={(e) =>
                      setCancelReason(
                        e.target.value
                      )
                    }
                  />
                  <label className="form-check-label">
                    Personal emergency
                  </label>
                </div>

                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="reason"
                    value="Other"
                    checked={
                      cancelReason ===
                      "Other"
                    }
                    onChange={(e) =>
                      setCancelReason(
                        e.target.value
                      )
                    }
                  />
                  <label className="form-check-label">
                    Other
                  </label>
                </div>

                {cancelReason ===
                  "Other" && (
                  <div className="mt-3">
                    <label className="form-label">
                      Enter Custom Reason
                    </label>

                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Enter cancellation reason"
                      value={
                        customReason
                      }
                      onChange={(e) =>
                        setCustomReason(
                          e.target.value
                        )
                      }
                    />
                  </div>
                )}

              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setShowCancelModal(
                      false
                    )
                  }
                >
                  Close
                </button>

                <button
                  className="btn btn-danger"
                  onClick={
                    confirmCancelBooking
                  }
                >
                  Confirm Cancellation
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}