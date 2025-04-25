import React from "react";
import { useAuth } from "../components/AuthContext/AuthContext";

const LogoutButton = () => {
  const { setUser } = useAuth();

  const handleLogout = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/user/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <button className="btn btn-danger" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
