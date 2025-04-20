const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const SwapRequest = require("../models/SwapRequest");
const authenticate = require("../middleware/authenticate");

// Get or Create Chat for Accepted Swap
router.get("/chat/:swapId", authenticate, async (req, res) => {
  try {
    const swapId = req.params.swapId;

    let chat = await Chat.findOne({ swapRequest: swapId }).populate(
      "messages.sender",
      "name"
    );

    if (!chat) {
      const swap = await SwapRequest.findById(swapId);

      if (!swap || swap.status !== "accepted") {
        return res.status(400).json({ message: "Swap not accepted yet." });
      }

      chat = new Chat({
        swapRequest: swapId,
        participants: [swap.requestedBy, swap.requestedTo],
        messages: [],
      });

      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a Message
router.post("/chat/:swapId/message", authenticate, async (req, res) => {
  try {
    const { text } = req.body;
    const chat = await Chat.findOne({ swapRequest: req.params.swapId });

    if (!chat) return res.status(404).json({ message: "Chat not found." });

    const message = {
      sender: req.user.id,
      text,
    };

    chat.messages.push(message);
    await chat.save();

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
