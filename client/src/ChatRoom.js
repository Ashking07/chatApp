// ChatRoom.js
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Initialize the socket connection with token authentication
const socket = io("http://localhost:8080", {
  auth: {
    token: localStorage.getItem("token"), // Send token from localStorage
  },
});

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Listen for messages from the server
    socket.on("message", (data) => {
      console.log("Message received on client:", data); // Debugging line
      setMessages((prev) => [...prev, data]);
    });

    // Clean up listener on unmount
    return () => {
      socket.off("message");
    };
  }, []);

  const joinRoom = () => {
    if (roomId && userName) {
      console.log(`Joining room: ${roomId} as ${userName}`); // Debugging line
      socket.emit("join-room", { roomId, userName });
      setMessages([]); // Clear messages when joining a new room
    }
  };

  const sendMessage = () => {
    if (newMessage) {
      console.log(`Sending message to room ${roomId}: ${newMessage}`); // Debugging line
      socket.emit("send-message", { roomId, message: newMessage });
      setNewMessage(""); // Clear input field
    }
  };

  return (
    <div>
      <h1>React Chat Rooms</h1>
      <div>
        <input
          type="text"
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
      <div>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>
              <strong>{msg.userName || "Unknown"}:</strong>{" "}
              {msg.message || "No message"}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
