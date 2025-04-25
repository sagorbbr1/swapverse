import React from "react";
import { useAuth } from "../components/AuthContext/AuthContext";

const LogoutButton = () => {
  const { setUser } = useAuth();

  const handleLogout = async () => {
    await fetch("https://swapverse-back.vercel.app/api/logout", {
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
