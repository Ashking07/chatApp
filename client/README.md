Prototype 1: 17:55 24th Nov 2024

Current implementation of The NodeChat, the process works as follows:

1. Message Flow Overview:
   A user sends a message using the client-side interface.
   The message is sent to the server using Socket.io.
   Socket.io handles the real-time communication:
   It broadcasts the message to all connected users in the same room.
   This ensures that users see the message instantly on their screens.
   Simultaneously, the server stores the message in data.js for persistence.
2. Step-by-Step Breakdown:
   (1) Client Sends a Message:

The client uses:
socket.emit("send-message", { roomId, message });
This sends the message and roomId to the server over the WebSocket connection.
(2) Server Processes the Message:

On the server, the send-message event is handled:
socket.on("send-message", ({ roomId, message }) => {
// Create a new message object
const newMessage = {
sender: socket.user.userName,
text: message,
timestamp: new Date().toISOString(),
};

// Find the room in the data or create a new one
const room = data.messages.find((room) => room.roomId === roomId) || createRoom(roomId);
room.chats.push(newMessage);

// Save the updated data to data.js for persistence
fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

// Broadcast the message to all users in the room
io.to(roomId).emit("message", newMessage);
});
(3) Real-Time Update (Broadcast to All Users):

The io.to(roomId).emit("message", newMessage) broadcasts the message to all connected users in the room.
This ensures that users see the new message immediately.
(4) Data Persistence:

The server then writes the message to data.js:
fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
This ensures that:
Messages are not lost if the server restarts.
Users joining the room later can view the chat history. 3. Key Points:
Messages first appear on users’ screens in real-time via Socket.io.
They are then stored in data.js for persistence.
When a user joins a room, the server can fetch chat history from data.js and send it to the client for display. 4. Future Enhancements:
Once we move to a database like MongoDB:

The process will be similar:
Real-time updates via Socket.io.
Data stored in the database instead of data.js.
The chat history will be fetched from the database when needed, ensuring scalability and long-term storage.
