import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userName =
    localStorage.getItem("name") ||
    localStorage.getItem("userName") ||
    "User";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("userName");

    alert("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "nav-link active fw-bold text-warning"
      : "nav-link";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          ⚽ Champion Turf
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto align-items-lg-center">

            {/* Home */}
            <li className="nav-item">
              <Link
                className={isActive("/")}
                to="/"
              >
                Home
              </Link>
            </li>

            {token ? (
              <>
                {/* Dashboard */}
                <li className="nav-item">
                  <Link
                    className={isActive("/dashboard")}
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>

                {/* Book Turf */}
                <li className="nav-item">
                  <Link
                    className={isActive("/booking")}
                    to="/booking"
                  >
                    Book Turf
                  </Link>
                </li>

                {/* My Bookings */}
                <li className="nav-item">
                  <Link
                    className={isActive("/my-bookings")}
                    to="/my-bookings"
                  >
                    My Bookings
                  </Link>
                </li>

                {/* User Welcome */}
                <li className="nav-item mx-lg-3 my-2 my-lg-0">
                  <span className="badge bg-success fs-6">
                    Welcome, {userName}
                  </span>
                </li>

                {/* Logout */}
                <li className="nav-item">
                  <button
                    className="btn btn-danger"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Login */}
                <li className="nav-item">
                  <Link
                    className={isActive("/login")}
                    to="/login"
                  >
                    Login
                  </Link>
                </li>

                {/* Register */}
                <li className="nav-item ms-lg-2">
                  <Link
                    to="/register"
                    className="btn btn-success"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}