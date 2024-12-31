const { Server } = require("socket.io");

// PORT 8000
const io = new Server(8000, {
  cors: true,
});
// Connection
const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);
    io.to(socket.id).emit("room:join", email);
  });
});
