import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import logo from "../logo.png";
import { Link } from "react-router";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast("Registration successful!");
        window.location.href = "/";
      } else {
        toast(data.message);
      }
    } catch (err) {
      toast("Something went wrong!");
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="container py-5 d-flex flex-column align-items-center">
      <img
        className="logo mb-3"
        src={logo}
        alt="logo"
        style={{ width: "100px" }}
      />
      <h5 className="mb-4 fw-semibold text-primary">Register to SwapVerse</h5>

      <form
        className="w-100"
        style={{ maxWidth: "400px" }}
        onSubmit={handleSubmit}
      >
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="fullname"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
          <label htmlFor="fullname">Full Name</label>
        </div>

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

        <div className="form-floating mb-3">
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

        <div className="form-floating mb-4">
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
        </div>

        <button
          type="submit"
          className="btn btn-info text-white w-100 fw-semibold py-2"
        >
          Register
        </button>

        <p className="mx-auto mt-3 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <ToastContainer />
      </form>
    </div>
  );
};

export default Register;
