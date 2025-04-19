const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const Item = require("../models/Item.js");
const authenticate = require("../middleware/authenticate.js");

const storage = multer.diskStorage({
  destination: "uploads/items",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// CREATE ITEM
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

// UPDATE ITEM
router.put("/:id", authenticate, upload.single("image"), async (req, res) => {
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

    if (req.file) {
      item.image = req.file.filename;
    }

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
