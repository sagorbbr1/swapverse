import React, { useState, useEffect } from "react";
import axios from "axios";

import "./ChatRoom.css";
import Navbar from "../Navbar/Navbar";
import { useAuth } from "../AuthContext/AuthContext";
import { Link } from "react-router";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import socket from "../../socket";
import ScrollToBottom from "react-scroll-to-bottom";
import { HashLoader } from "react-spinners";

const ChatRoom = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/chats", {
          withCredentials: true,
        });
        setChats(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (currentChat) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/chats/${currentChat._id}/messages`,
            {
              withCredentials: true,
            }
          );
          setMessages(response.data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching messages:", err);
          setLoading(false);
        }
      };

      fetchMessages();
    }
  }, [currentChat]);

  useEffect(() => {
    if (!socket || !currentChat) return;

    socket.emit("join_room", currentChat._id);

    const handleReceive = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("message_received", handleReceive);

    return () => {
      socket.emit("leave_room", currentChat._id);
      socket.off("message_received", handleReceive);
    };
  }, [currentChat]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/chats/${currentChat._id}/messages`,
          { content: newMessage },
          {
            withCredentials: true,
          }
        );

        socket.emit("send_message", {
          roomId: currentChat._id,
          message: response.data,
        });

        setNewMessage("");
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  if (loading)
    return (
      <HashLoader
        className="loader"
        color={"#36d7b7"}
        loading={loading}
        cssOverride={{
          margin: "0 auto",
          borderColor: "red",

          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );

  return (
    <>
      <Navbar />

      <div className="container py-3">
        <div className="row">
          <div className="col-12 col-md-4 mb-3">
            <div className="chat-list bg-white p-3 rounded shadow-sm h-100">
              <h6 className="text-center text-primary mb-4">
                Available chat users
              </h6>

              {chats &&
                [
                  ...new Map(
                    chats
                      .map((chat) => {
                        const otherUser = chat.users.find(
                          (u) => u?._id !== user?._id
                        );
                        return otherUser
                          ? [otherUser._id, { chat, otherUser }]
                          : null;
                      })
                      .filter(Boolean)
                  ).values(),
                ].map(({ chat, otherUser }) => (
                  <div
                    key={chat._id}
                    onClick={() => setCurrentChat(chat)}
                    className="chat-item bg-primary-subtle my-2 p-2 rounded"
                    style={{ cursor: "pointer" }}
                  >
                    Chat with {otherUser.fullname}
                  </div>
                ))}
            </div>
          </div>

          {currentChat && (
            <div className="col-12 col-md-8">
              <div
                className="chat-window bg-white rounded shadow p-3 d-flex flex-column justify-content-between"
                style={{ minHeight: "500px" }}
              >
                <div className="d-flex align-items-center border-bottom pb-2 mb-2">
                  <Link to="/received_request">
                    <ArrowLeftCircle className="me-2" />
                  </Link>
                  <h5 className="text-primary m-0">
                    {currentChat?.users
                      ?.map((u) => u.fullname)
                      .filter((name) => name !== user.fullname)}
                  </h5>
                </div>

                <div className="message-box flex-grow-1 overflow-auto mb-3">
                  <ScrollToBottom>
                    <div className="message-list px-3 py-2">
                      {messages &&
                        messages.map((msg) => (
                          <div
                            key={msg._id}
                            className={`p-2 message mb-2 ${
                              msg.sender?._id === user?._id
                                ? "text-end sender"
                                : "text-start receiver"
                            }`}
                          >
                            <strong>{msg.sender.fullname}:</strong>{" "}
                            {msg.content}
                          </div>
                        ))}
                    </div>
                  </ScrollToBottom>
                </div>

                <div className="message-input w-50 mx-auto d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                  />
                  <button
                    className="btn btn-success"
                    onClick={handleSendMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
