import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import LogoutButton from "../../pages/LogoutButton";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/">
        SwapVerse
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
            <LogoutButton />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
