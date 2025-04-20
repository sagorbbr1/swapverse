const express = require("express");
const router = express.Router();
const SwapRequest = require("../models/SwapRequest");
const Item = require("../models/Item");

const authenticate = require("../middleware/authenticate.js");

router.post("/swap", authenticate, async (req, res) => {
  const { requesterItemId, targetItemId } = req.body;

  console.log("REQ USER ID:", req.user.id);
  console.log("Requester Item:", requesterItemId);
  console.log("Target Item:", targetItemId);

  try {
    const existing = await SwapRequest.findOne({
      requester: req.user.id,
      requesterItem: requesterItemId,
      targetItem: targetItemId,
    });

    if (existing) {
      return res.status(400).json({ message: "Swap request already sent." });
    }

    const swap = new SwapRequest({
      requester: req.user.id,
      requesterItem: requesterItemId,
      targetItem: targetItemId,
    });

    await swap.save();
    res.status(201).json({ message: "Swap request sent." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err });
  }
});

module.exports = router;
