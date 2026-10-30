import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Dashboard() {
  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const userId =
        localStorage.getItem("userId");

      const response = await API.get(
        `/bookings/${userId}`
      );

      setBookings(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    const userId =
      localStorage.getItem("userId");

    if (!token || !userId) {
      localStorage.clear();
      navigate("/login");
      return;
    }

    fetchBookings();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border"></div>
        <h4 className="mt-3">
          Loading Dashboard...
        </h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>Champion Turf Dashboard</h1>

      <div className="mb-3">
        <button
          className="btn btn-success me-2"
          onClick={() =>
            navigate("/booking")
          }
        >
          Book Turf
        </button>

        <button
          className="btn btn-info me-2"
          onClick={() =>
            navigate("/my-bookings")
          }
        >
          My Bookings
        </button>

        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5>Total Bookings</h5>
              <h2>{bookings.length}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}