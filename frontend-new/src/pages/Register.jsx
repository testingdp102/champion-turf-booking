import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required Fields Validation
    if (
      !form.name ||
      !form.email ||
      !form.mobile ||
      !form.password
    ) {
      alert("All fields are required");
      return;
    }

    // Mobile Digits Only Validation
    if (!/^\d+$/.test(form.mobile)) {
      alert(
        "Mobile number must contain digits only"
      );
      return;
    }

    // Mobile Length Validation
    if (form.mobile.length !== 10) {
      alert(
        "Mobile number must be 10 digits"
      );
      return;
    }

    // Password Validation
    if (form.password.length < 6) {
      alert(
        "Password must contain at least 6 characters"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/register",
        form
      );

      alert(
        response.data.message ||
          "Registration Successful"
      );

      navigate("/login");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow">
            <div className="card-body p-4">

              <h2 className="text-center mb-4">
                Champion Turf Registration
              </h2>

              <form onSubmit={handleSubmit}>

                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter Name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter Email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Mobile */}
                <div className="mb-3">
                  <label className="form-label">
                    Mobile Number
                  </label>

                  <input
                    type="text"
                    name="mobile"
                    className="form-control"
                    placeholder="Enter Mobile Number"
                    value={form.mobile}
                    onChange={(e) => {
                      const value =
                        e.target.value.replace(
                          /\D/g,
                          ""
                        );

                      setForm({
                        ...form,
                        mobile: value,
                      });
                    }}
                    disabled={loading}
                    maxLength={10}
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="form-label">
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
                      className="form-control"
                      placeholder="Enter Password"
                      value={form.password}
                      onChange={handleChange}
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
                      <i
                        className={
                          showPassword
                            ? "bi bi-eye-slash"
                            : "bi bi-eye"
                        }
                      ></i>
                    </button>

                  </div>
                </div>

                {/* Register Button */}
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
                <p>
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