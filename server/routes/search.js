const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
router.get("/search/", async (req, res) => {
  const { search } = req.query;

  const query = search
    ? {
        $or: [
          { title: new RegExp(search, "i") },
          { description: new RegExp(search, "i") },
          { category: new RegExp(search, "i") },
          { condition: new RegExp(search, "i") },
        ],
      }
    : {};

  const items = await Item.find(query).populate("user");
  res.json(items);
});

module.exports = router;
