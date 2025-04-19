const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  condition: {
    type: String,
    enum: ["New", "Good", "Used", "Broken"],
    required: true,
  },
  swapWishList: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Item", itemSchema);
