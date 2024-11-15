import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080"); // Connect to the Node.js server

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Listen for messages from the server
    socket.on("message", ({ userName, message }) => {
      setMessages((prev) => [...prev, { userName, message }]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const joinRoom = () => {
    if (roomId && userName) {
      socket.emit("join-room", { roomId, userName });
      setMessages([]); // Clear messages when joining a new room
    }
  };

  const sendMessage = () => {
    if (newMessage) {
      socket.emit("send-message", { roomId, message: newMessage, userName });
      setNewMessage(""); // Clear the input field
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
              <strong>{msg.userName}:</strong> {msg.message}
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

export default App;
