import { useState, useEffect } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { FaFutbol } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "mobile"
          ? value.replace(/\D/g, "")
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const res = await API.post(
        "/auth/login",
        form
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <FaFutbol
              size={55}
              color="#16a34a"
              className="mb-3 football-icon"
            />

            <h1 className="auth-heading">
              Welcome Back
            </h1>

            <p className="text-muted">
              Login to continue booking
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Mobile Number
              </label>

              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                maxLength={10}
                placeholder="Enter Mobile Number"
                className="form-control auth-input"
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Password
              </label>

              <div className="input-group">
              <input
  type={
    showPassword
      ? "text"
      : "password"
  }
  name="password"
  value={form.password}
  onChange={handleChange}
  placeholder="Enter Password"
  className="form-control auth-input"
/>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn auth-btn w-100 ${
                loading ? "loading" : ""
              }`}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">
              Don't have an account?
            </span>{" "}
            <Link
              to="/register"
              className="auth-link"
            >
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}