import { useState, useEffect } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { FaFutbol } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "mobile"
          ? value.replace(/\D/g, "")
          : value,
    }));
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

      console.log("Login Response:", res.data);

      localStorage.setItem(
        "token",
        res.data.token
      );

     localStorage.setItem(
  "user",
  JSON.stringify(res.data.user)
);

localStorage.setItem(
  "userId",
  res.data.user.id
);
      console.log(
        "Stored Token:",
        localStorage.getItem("token")
      );

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

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
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <div className="card auth-card">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <FaFutbol
                    size={60}
                    color="#16a34a"
                    className="football-icon mb-3"
                  />

                  <h1 className="auth-heading">
                    Welcome Back
                  </h1>

                  <p className="text-muted">
                    Login to continue booking your turf
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
                      required
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
                        required
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
  <span
    style={{
      color: "#64748b",
      fontWeight: "600",
      fontSize: "15px",
    }}
  >
    Don't have an account?
  </span>{" "}

  <Link
    to="/register"
    className="register-link"
  >
    Register Here 🚀
  </Link>
</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}