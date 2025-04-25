const express = require("express");
const router = express.Router();
const Item = require("../models/Item.js");

const authenticate = require("../middleware/authenticate.js");
router.get("/items", authenticate, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).populate("user", [
      "title",
    ]);

    if (!items || items.length === 0) {
      return res.status(404).json({ message: "No items found for this user." });
    }

    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load your items." });
  }
});

module.exports = router;
