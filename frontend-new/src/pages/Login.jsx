import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mobile) {
      alert("Please enter mobile number");
      return;
    }

    if (!formData.password) {
      alert("Please enter password");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "userId",
        response.data.userId
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login Failed"
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
                Champion Turf Login
              </h2>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">
                    Mobile Number
                  </label>

                  <input
                    type="text"
                    name="mobile"
                    className="form-control"
                    placeholder="Enter Mobile Number"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mobile:
                          e.target.value.replace(
                            /\D/g,
                            ""
                          ),
                      })
                    }
                    maxLength={10}
                  />
                </div>

                <div className="mb-3">
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
                      value={formData.password}
                      onChange={handleChange}
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
                      Logging In...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>

              </form>

              <div className="text-center mt-3">
                <p>
                  Don't have an account?{" "}
                  <Link to="/register">
                    Register
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