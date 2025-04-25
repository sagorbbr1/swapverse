import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import LogoutButton from "../../pages/LogoutButton";
import logo from "../../../src/logo.png";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <div className="d-flex align-items-center gap-3">
            <img
              src={logo}
              alt="logo"
              className="logo"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
            <h4 className="mb-0">SwapVerse</h4>
          </div>
        </Link>

        {/* Toggler for small screens */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Collapsible content */}
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarContent"
        >
          <div className="d-flex gap-3 align-items-center mt-3 mt-lg-0">
            {!user && (
              <>
                <Link to="/login" className="btn btn-outline-primary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}

            {user && (
              <>
                <span className="text-muted">Hello, {user.fullname}</span>
                <Link to="/profile" className="btn btn-outline-primary">
                  Profile
                </Link>
                <LogoutButton />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
