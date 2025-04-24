const express = require("express");
const router = express.Router();
const multer = require("multer");
const Item = require("../models/Item.js");
const authenticate = require("../middleware/authenticate.js");

const storage = multer.diskStorage({
  destination: "uploads/items",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post(
  "/items",
  authenticate,
  upload.single("image"),
  async (req, res) => {
    const { title, description, category, condition, swapWishList } = req.body;

    if (!title || !description || !category || !condition || !swapWishList) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      const image = req.file ? req.file.filename : "";

      const item = new Item({
        user: req.user.id,
        title,
        description,
        category,
        condition,
        swapWishList,
        image,
      });

      await item.save();
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

//Get Item

router.get("/items/:id", authenticate, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("user", ["name"]);
    if (!item) return res.status(404).json({ message: "Item not found." });
    res.status(200).json(item);
  } catch (err) {
    console.error("Error fetching item:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/items/:id", authenticate, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found." });

    if (item.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized." });

    const { title, description, category, condition, swapWishList } = req.body;

    item.title = title;
    item.description = description;
    item.category = category;
    item.condition = condition;
    item.swapWishList = swapWishList;

    await item.save();
    res.status(200).json(item);
  } catch (err) {
    console.error("Error editing item:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/items/:id", authenticate, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found." });

    if (item.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized." });

    await item.deleteOne();
    res.status(200).json({ message: "Item deleted successfully." });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
