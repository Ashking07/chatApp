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

  // const joinRoom = () => {
  //   if (roomId && userName) {
  //     console.log(`Joining room: ${roomId} as ${userName}`); // Debugging line
  //     socket.emit("join-room", { roomId, userName });
  //     setMessages([]); // Clear messages when joining a new room
  //   }
  // };

  const joinRoom = async () => {
    if (roomId && userName) {
      console.log(`Joining room: ${roomId} as ${userName}`); // Debugging line

      // Emit join-room event to the server
      socket.emit("join-room", { roomId, userName });

      try {
        // Fetch chat history for the room from the server
        const response = await fetch(
          `http://localhost:8080/api/messages/${roomId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch messages for room ${roomId}`);
        }

        const roomData = await response.json();

        // Update the messages state with the fetched chat history
        if (roomData && roomData.chats) {
          setMessages(roomData.chats);
        } else {
          console.warn("No chat history found for this room.");
        }
      } catch (err) {
        console.error("Error fetching room messages:", err);
      }
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
              <strong>{msg.sender || "Unknown"}:</strong>{" "}
              {msg.message || msg.text || "No message"}
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
