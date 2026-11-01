import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div
        className="text-white text-center py-5"
        style={{
          background:
            "linear-gradient(135deg, #0d6efd, #198754)",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="container">
          <h1 className="display-3 fw-bold mb-3">
            ⚽ Nav Durga Indoor Games TURF !
          </h1>

          <p className="lead mb-4">
            Book your favorite turf anytime,
            anywhere. Fast, simple and secure.
          </p>

          <div>
            <Link
              to="/register"
              className="btn btn-light btn-lg me-3"
            >
              Register
            </Link>

            <Link
              to="/login"
              className="btn btn-outline-light btn-lg"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container py-5">
        <h2 className="text-center mb-5">
          Why Choose NDIG Turf?
        </h2>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow h-100 border-0">
              <div className="card-body text-center">
                <h3>⚡</h3>
                <h5>Quick Booking</h5>
                <p>
                  Book your turf within seconds.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow h-100 border-0">
              <div className="card-body text-center">
                <h3>📅</h3>
                <h5>Manage Bookings</h5>
                <p>
                  View and cancel bookings
                  easily.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow h-100 border-0">
              <div className="card-body text-center">
                <h3>🔒</h3>
                <h5>Secure Login</h5>
                <p>
                  Protected account and booking
                  access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-light py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4">
              <h2 className="text-primary fw-bold">
                500+
              </h2>
              <p>Bookings</p>
            </div>

            <div className="col-md-4">
              <h2 className="text-success fw-bold">
                200+
              </h2>
              <p>Active Players</p>
            </div>

            <div className="col-md-4">
              <h2 className="text-danger fw-bold">
                99%
              </h2>
              <p>Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">
          © 2026 Champion Turf. All Rights
          Reserved.
        </p>
      </footer>
    </>
  );
}