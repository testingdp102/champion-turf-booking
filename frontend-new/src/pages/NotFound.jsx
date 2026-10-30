import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container text-center mt-5">
      <h1>404</h1>
      <h3>Page Not Found</h3>

      <Link
        className="btn btn-primary mt-3"
        to="/login"
      >
        Go To Login
      </Link>
    </div>
  );
}