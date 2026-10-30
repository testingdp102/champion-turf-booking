import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Booking() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      booking_date: "",
      start_time: "",
      end_time: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async (e) => {
    if (loading) return;

    e.preventDefault();

    if (!formData.booking_date) {
      alert("Please select booking date");
      return;
    }

    if (!formData.start_time) {
      alert("Please select start time");
      return;
    }

    if (!formData.end_time) {
      alert("Please select end time");
      return;
    }

    if (
      formData.start_time >=
      formData.end_time
    ) {
      alert(
        "End time must be greater than start time"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/bookings",
        {
          user_id:
            localStorage.getItem(
              "userId"
            ),
          booking_date:
            formData.booking_date,
          start_time:
            formData.start_time,
          end_time: formData.end_time,
        }
      );

      alert(response.data.message);

      navigate("/dashboard");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Booking Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h2>Champion Turf</h2>

          <form onSubmit={handleBooking}>
            <div className="mb-3">
              <input
                type="date"
                name="booking_date"
                className="form-control"
                value={
                  formData.booking_date
                }
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <input
                type="time"
                name="start_time"
                className="form-control"
                value={
                  formData.start_time
                }
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <input
                type="time"
                name="end_time"
                className="form-control"
                value={formData.end_time}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating Booking...
                </>
              ) : (
                "Book Now"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}