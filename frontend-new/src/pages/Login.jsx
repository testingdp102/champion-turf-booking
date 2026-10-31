import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

import {
  validateEmail,
  validatePassword,
} from "../utils/validation";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [navigate]);

  const validateField = (
    name,
    value
  ) => {
    switch (name) {
      case "email":
        return validateEmail(value);

      case "password":
        return validatePassword(value);

      default:
        return "";
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setServerError("");

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(form.email),
      password: validatePassword(
        form.password
      ),
    };

    setErrors(newErrors);

    return !Object.values(
      newErrors
    ).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/login",
        {
          email: form.email.trim(),
          password: form.password,
        }
      );

      const { token, user } =
        response.data;

      if (!token || !user) {
        throw new Error(
          "Invalid login response"
        );
      }

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "userId",
        user.id
      );

      localStorage.setItem(
        "name",
        user.name
      );

      localStorage.setItem(
        "email",
        user.email || ""
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      if (!error.response) {
        setServerError(
          "Unable to connect to server. Please try again."
        );
      } else {
        setServerError(
          error.response?.data?.message ||
            "Invalid email or password"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          width: "100%",
          maxWidth: "450px",
          borderRadius: "16px",
        }}
      >
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold">
              Welcome Back
            </h2>

            <p className="text-muted">
              Login to Champion Turf
            </p>
          </div>

          {serverError && (
            <div className="alert alert-danger">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                className={`form-control ${
                  errors.email
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Enter email"
                value={form.email}
                onChange        onBlur={handleBlur}
                disabled={loading}
              />

              {errors.email && (
                <div className="invalid-feedback d-block">
                  {errors.email}
                </div>
              )}
            </div>

            <div className="mb-3">
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
                  className={`form-control ${
                    errors.password
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
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

              {errors.password && (
                <div className="text-danger small mt-1">
                  {errors.password}
                </div>
              )}
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Logging In...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">
              Don't have an account?
            </span>{" "}
            <Link
              to="/register"
              className="fw-semibold text-decoration-none"
            >
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}