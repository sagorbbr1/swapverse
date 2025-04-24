import React, { useState } from "react";
import logo from "../logo.png";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      toast("All fields are required!");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast("Login successful!");
        window.location.href = "/";
      } else {
        toast(data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      toast("Something went wrong!");
    }
  };

  return (
    <div className="container py-5 d-flex flex-column align-items-center">
      <Link to="/">
        {" "}
        <img
          className="logo mb-3"
          src={logo}
          alt="logo"
          style={{ width: "100px" }}
        />
      </Link>
      <h4 className="mb-4 fw-semibold text-primary">Login to SwapVerse</h4>

      <form
        className="w-100"
        style={{ maxWidth: "400px" }}
        onSubmit={handleSubmit}
      >
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="email">Email address</label>
        </div>

        <div className="form-floating mb-4">
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password</label>
        </div>

        <button
          type="submit"
          className="btn btn-info text-white w-100 fw-semibold py-2"
        >
          Login
        </button>
        <p className="mx-auto mt-3 text-center">
          No account?{" "}
          <Link className="text-primary" to="/register">
            Create One
          </Link>
        </p>
        <ToastContainer />
      </form>
    </div>
  );
};

export default Login;
