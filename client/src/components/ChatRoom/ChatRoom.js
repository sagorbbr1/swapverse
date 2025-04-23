import React, { useState, useEffect } from "react";
import axios from "axios";

import "./ChatRoom.css";
import Navbar from "../Navbar/Navbar";
import { useAuth } from "../AuthContext/AuthContext";
import { Link } from "react-router";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import socket from "../../socket";
import ScrollToBottom from "react-scroll-to-bottom";

const ChatRoom = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get("/api/chats");
        setChats(response.data);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (currentChat) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `/api/chats/${currentChat._id}/messages`
          );
          setMessages(response.data);
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      };

      fetchMessages();
    }
  }, [currentChat]);

  useEffect(() => {
    if (currentChat) {
      socket.emit("join_room", currentChat._id);

      const handleReceive = (message) => {
        console.log("Received:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      socket.on("message_received", handleReceive);

      return () => {
        socket.emit("leave_room", currentChat._id);
        socket.off("message_received", handleReceive);
      };
    }
  }, [currentChat]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await axios.post(
          `/api/chats/${currentChat._id}/messages`,
          { content: newMessage }
        );

        socket.emit("send_message", {
          roomId: currentChat._id,
          message: response.data,
        });

        setMessages((prev) => [...prev, response.data]);
        setNewMessage("");
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="chat-container">
        <div className="chat-list">
          <h6 className="text-center text-primary mb-4">
            Available chat users
          </h6>
          {chats &&
            chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setCurrentChat(chat)}
                className="chat-item bg-primary-subtle my-2"
              >
                Chat with{" "}
                {chat.users
                  .map((user) => user.fullname)

                  .filter((name) => name !== user.fullname)}
              </div>
            ))}
        </div>

        {currentChat && (
          <div className="chat-window shadow-lg  w-50 mx-auto position-relative">
            <div className=" d-flex align-items-center border">
              <div className="d-flex align-items-center">
                <Link to="/received_request">
                  <ArrowLeftCircle className="back-btn" />
                </Link>

                <h5 className="text-center text-primary m-0 ms-2">
                  {currentChat?.users
                    ?.map((user) => user.fullname)

                    .filter((name) => name !== user.fullname)}
                </h5>
              </div>
            </div>

            <div className="bg-light">
              <ScrollToBottom>
                <div className="message-list px-4 ">
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`message ${
                        msg.sender._id === user._id ? "sender" : "receiver"
                      }`}
                    >
                      <strong>{msg.sender.fullname}: </strong>
                      <span>{msg.content}</span>
                    </div>
                  ))}
                </div>
              </ScrollToBottom>
            </div>

            <div className="message-input position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
              />
              <button className="btn btn-success" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatRoom;
