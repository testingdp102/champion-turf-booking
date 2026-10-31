import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { FaFutbol } from "react-icons/fa";

import {
  validateName,
  validateEmail,
  validateMobile,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validation";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const getPasswordStrength = () => {
    const password = form.password;

    if (!password) return null;

    if (password.length < 6) {
      return {
        text: "Weak",
        className: "text-danger",
      };
    }

    if (password.length < 8) {
      return {
        text: "Medium",
        className: "text-warning",
      };
    }

    return {
      text: "Strong",
      className: "text-success",
    };
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return validateName(value);

      case "email":
        return validateEmail(value);

      case "mobile":
        return validateMobile(value);

      case "password":
        return validatePassword(value);

      case "confirmPassword":
        return validateConfirmPassword(
          form.password,
          value
        );

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

    const updatedValue =
      name === "mobile"
        ? value.replace(/\D/g, "")
        : value;

    setForm((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    setServerError("");

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, updatedValue),
    }));

    if (
      name === "password" &&
      form.confirmPassword
    ) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          validateConfirmPassword(
            updatedValue,
            form.confirmPassword
          ),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      mobile: validateMobile(form.mobile),
      password: validatePassword(
        form.password
      ),
      confirmPassword:
        validateConfirmPassword(
          form.password,
          form.confirmPassword
        ),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(
      (error) => error
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/register",
        {
          name: form.name.trim(),
          email: form.email.trim(),
          mobile: form.mobile,
          password: form.password,
        }
      );

      setSuccessMessage(
        response.data.message ||
          "Registration successful!"
      );

      setForm({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
      });

      setErrors({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength =
    getPasswordStrength();

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="card-body p-3 p-sm-4 p-md-5">
          <div className="text-center mb-4">
            <FaFutbol
              size={55}
              color="#16a34a"
              className="mb-3"
            />

            <h1 className="auth-heading">
              Join Champion Turf
            </h1>

            <p className="text-muted mb-1">
              Create your account and start booking
            </p>

            <div
              style={{
                color: "#16a34a",
                fontWeight: "600",
              }}
            >
              ⚽ Join the Champions
            </div>
          </div>

          {serverError && (
            <div className="alert alert-danger">
              {serverError}
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                placeholder="Enter Name"
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`form-control auth-input ${
                  errors.name
                    ? "is-invalid"
                    : ""
                }`}
              />

              <div className="invalid-feedback">
                {errors.name}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                placeholder="Enter Email"
                onChange={handleChange}
                onBlur={handleBlur}
                disabled   className={`form-control auth-input ${
                  errors.email
                    ? "is-invalid"
                    : ""
                }`}
              />

              <div className="invalid-feedback">
                {errors.email}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Mobile Number
              </label>

              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                placeholder="Enter Mobile Number"
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={10}
                inputMode="numeric"
                disabled={loading}
                className={`form-control auth-input ${
                  errors.mobile
                    ? "is-invalid"
                    : ""
                }`}
              />

              <div className="invalid-feedback">
                {errors.mobile}
              </div>
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
                  value={form.password}
                  placeholder="Enter Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`form-control auth-input ${
                    errors.password
                      ? "is-invalid"
                      : ""
                  }`}
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

              {passwordStrength && (
                <div
                  className={`small mt-1 ${passwordStrength.className}`}
                >
                  Password Strength:{" "}
                  {passwordStrength.text}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Confirm Password
              </label>

              <div className="input-group">
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={form.confirmPassword}
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`form-control auth-input ${
                    errors.confirmPassword
                      ? "is-invalid"
                      : ""
                  }`}
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁️"}
                </button>
              </div>

              {errors.confirmPassword && (
                <div className="text-danger small mt-1">
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn auth-btn w-100"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">
              Already have an account?
            </span>{" "}
            <Link
              to="/login"
              className="auth-link"
            >
              Login Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}