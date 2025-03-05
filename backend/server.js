const app = require("./src/app");
const connect = require("./src/db/db");

connect();

const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    const projectId = socket.handshake.query.projectId;
     if (!projectId) {
        console.log("No projectId received in handshake!");
        return;
    }
    console.log(`User ${socket.id} connected to project: ${projectId}`);
    // Join a room based on projectId
    socket.join(projectId);
  // Listen for incoming messages
  socket.on("message", (message) => {

    console.log(`Received message ....: ${message}`);

    // Broadcast the message to all clients except the sender
    socket.broadcast.to(projectId).emit ('message' , message);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
