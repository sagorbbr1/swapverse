const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const SwapRequest = require("../models/SwapRequest");
const Item = require("../models/Item");

router.post("/swap", authenticate, async (req, res) => {
  const { requesterItemId, targetItemId } = req.body;

  console.log(req.body);

  if (!requesterItemId || !targetItemId) {
    return res.status(400).json({ message: "Both items are required." });
  }

  try {
    const existingRequest = await SwapRequest.findOne({
      requester: req.user.id,
      requesterItem: requesterItemId,
      targetItem: targetItemId,
    });

    if (existingRequest) {
      return res
        .status(409)
        .json({ message: "You’ve already requested this swap." });
    }

    const swapRequest = new SwapRequest({
      requester: req.user.id,
      requesterItem: requesterItemId,
      targetItem: targetItemId,
    });

    await swapRequest.save();
    res.status(201).json(swapRequest);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
