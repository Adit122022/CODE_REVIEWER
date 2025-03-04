const app = require("./src/app");
const connect = require("./src/db/db");

connect();

const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for incoming messages
  socket.on("send_message", (message) => {
    console.log(`Received message: ${message}`);

    // Broadcast the message to all clients except the sender
    socket.broadcast.emit("receive_message", message);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
