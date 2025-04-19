import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import LogoutButton from "../../pages/LogoutButton";
import logo from "../../../src/logo.jpg";
const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
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

      <div className="ms-auto d-flex gap-3 align-items-center">
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
    </nav>
  );
};

export default Navbar;
