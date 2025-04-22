const express = require("express");
const router = express.Router();
const SwapRequest = require("../models/SwapRequest");
const Item = require("../models/Item");

const authenticate = require("../middleware/authenticate.js");

router.post("/swap", authenticate, async (req, res) => {
  const { requesterItemId, targetItemId, owner } = req.body;

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
      owner: owner,
      requesterItem: requesterItemId,
      targetItem: targetItemId,
    });

    await swap.save();
    res.status(201).json({ message: "Swap request sent." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err });
  }
});

router.get("/swap-requests", authenticate, async (req, res) => {
  try {
    const sent = await SwapRequest.find({ requester: req.user.id })
      .populate("requesterItem")
      .populate("targetItem")
      .populate("targetItem.user", "fullname")
      .populate("owner", "owner");

    const received = await SwapRequest.find()
      .populate("requester", "fullname")
      .populate("requesterItem")
      .populate({
        path: "targetItem",
        populate: {
          path: "user",
          select: "fullname _id",
        },
      });

    const filteredReceived = received.filter(
      (receivedItem) =>
        receivedItem?.targetItem?.user?._id.toString() === req.user.id &&
        receivedItem?.requester._id.toString() !== req.user.id
    );

    res.json({ sent, received: filteredReceived });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load swap requests.", error: err });
  }
});

router.put("/swap-requests/:id", authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await SwapRequest.findById(req.params.id);

    const targetItem = await Item.findById(request.targetItem);
    if (targetItem.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized." });
    }

    request.status = status;
    await request.save();

    res.json({ message: `Swap request ${status}` });
  } catch (err) {
    res.status(500).json({ message: "Error updating request." });
  }
});

module.exports = router;
