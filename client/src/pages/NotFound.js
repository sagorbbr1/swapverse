import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center px-3">
      <h1 className="display-1 fw-bold text-info">404</h1>
      <h4 className="mb-3 text-muted">Oops! Page not found.</h4>
      <p className="text-secondary mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-info text-white fw-semibold px-4">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
