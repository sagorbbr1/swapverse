const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });
router.put("/user/profile", upload.single("avatar"), async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.bio = req.body.bio;
    user.location = req.body.location;
    if (req.file) {
      user.avatar = `/${req.file.path}`;
    }

    await user.save();

    res.json({
      fullname: user.fullname,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
