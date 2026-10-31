import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

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

  const [errors, setErrors] = useState({});

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
      navigate("/dashboard");
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

    if (!validateForm()) {
      return;
    }

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

      setErrors({});

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);

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
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">
                Champion Turf Registration
              </h2>

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
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className={`form-control ${
                      errors.name
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter Name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                  />

                  <div className="invalid-feedback">
                    {errors.name}
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    className={`form-control ${
                      errors.email
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter Email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                  />

                  <div className="invalid-feedback">
                    {errors.email}
                  </div>
                </div>

                {/* Mobile */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    name="mobile"
                    className={`form-control ${
                      errors.mobile
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter Mobile Number"
                    value={form.mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={10}
                    inputMode="numeric"
                    disabled={loading}
                  />

                  <div className="invalid-feedback">
                    {errors.mobile}
                  </div>
                </div>

                {/* Password */}
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
                      placeholder="Enter Password"
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

                  {passwordStrength && (
                    <div
                      className={`small mt-1 ${passwordStrength.className}`}
                    >
                      Password Strength:{" "}
                      {passwordStrength.text}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
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
                      className={`form-control ${
                        errors.confirmPassword
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Confirm Password"
                      value={
                        form.confirmPassword
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
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
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>

              <div className="text-center mt-3">
                <p className="mb-0">
                  Already have an account?{" "}
                  <Link to="/login">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}