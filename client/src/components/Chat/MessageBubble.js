import React from "react";

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div
      className={`d-flex ${
        isOwn ? "justify-content-end" : "justify-content-start"
      }`}
    >
      <div
        className={`p-2 my-1 rounded ${
          isOwn ? "bg-primary text-white" : "bg-light text-dark"
        }`}
        style={{ maxWidth: "70%" }}
      >
        {message.text}
      </div>
    </div>
  );
};

export default MessageBubble;
