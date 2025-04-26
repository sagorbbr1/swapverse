const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ message: "User already exists." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: "Register successful!",
        user: {
          id: savedUser._id,
          fullname: savedUser.fullname,
          email: savedUser.email,
        },
      });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields are required." });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful!",
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
        },
      });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
