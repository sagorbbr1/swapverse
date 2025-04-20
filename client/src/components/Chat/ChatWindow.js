import React, { useEffect, useState } from "react";
import axios from "axios";
import MessageBubble from "./MessageBubble";

const ChatWindow = ({ swapId }) => {
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");

  // Fetch chat data when swapId changes
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await axios.get(`/api/chat/${swapId}`, {
          withCredentials: true,
        });
        setChat(res.data);

        const userRes = await axios.get("/api/user", { withCredentials: true });
        setUserId(userRes.data._id);
      } catch (err) {
        console.error("Failed to load chat", err);
      }
    };
    fetchChat();
  }, [swapId]);

  // Send a message
  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `/api/chat/${swapId}/message`,
        { text },
        { withCredentials: true }
      );
      setChat({ ...chat, messages: [...chat.messages, res.data] });
      setText("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  if (!chat) return <p>Loading chat...</p>;

  return (
    <div
      className="chat-window border p-3 rounded shadow-sm"
      style={{ height: "400px", overflowY: "auto" }}
    >
      <div className="chat-messages mb-3">
        {chat.messages.map((msg, index) => (
          <MessageBubble
            key={index}
            message={msg}
            isOwn={msg.sender._id === userId}
          />
        ))}
      </div>
      <div className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
