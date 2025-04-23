const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

router.get("/chats", authenticate, async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user.id }).populate(
      "users",
      "fullname"
    );
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: "Failed to get chats." });
  }
});

router.post("/chats", authenticate, async (req, res) => {
  try {
    const { userId } = req.body;

    let chat = await Chat.findOne({ users: { $all: [req.user.id, userId] } });

    if (!chat) {
      chat = new Chat({
        users: [req.user.id, userId],
      });

      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).json({ message: "Failed to create chat" });
  }
});

router.get("/chats/:chatId/messages", authenticate, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "fullname")
      .sort({ createdAt: 1 }); // Sort messages in ascending order (oldest first)
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to get messages." });
  }
});

router.post("/chats/:chatId/messages", authenticate, async (req, res) => {
  try {
    const { content } = req.body;

    const message = new Message({
      chat: req.params.chatId,
      sender: req.user.id,
      content,
    });

    await message.save();

    const populatedMessage = await message.populate("sender", "fullname");

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message." });
  }
});

module.exports = router;
