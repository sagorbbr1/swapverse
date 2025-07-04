const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const itemRoutes = require("./routes/item");
const OwnItems = require("./routes/ownItems");
const swapRoutes = require("./routes/swap");
const chatRoutes = require("./routes/chat");
const searchRoutes = require("./routes/search");
const { app, server } = require("./server");
const User = require("./models/User");
const cors = require("cors");
const verifyToken = require("./middleware/authenticate");

const cookieParser = require("cookie-parser");
const Item = require("./models/Item");

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/my-items", OwnItems);
app.use("/api/items", itemRoutes);
app.use("/api/swap", swapRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/chats", chatRoutes);
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find()
      .populate("user", "fullname")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch items", error: err.message });
  }
});

app.get("/api/user/profile", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

app.post("/api/user/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });
  res.json({ message: "Logged out successfully." });
});

app.get("/", (req, res) => {
  res.send("SwapVerse API is running");
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
