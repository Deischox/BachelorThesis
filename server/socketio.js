module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.emit("connected", socket.id);

    socket.on("get-room-amount", (roomId, userID) => {
      if (io.sockets.adapter.rooms.has(roomId)) {
        const amount = io.sockets.adapter.rooms.get(roomId).size;
        socket.emit("amountOfUser", amount);
      } else {
        socket.emit("amountOfUser", 0);
      }
    });
    socket.on("join-room", (roomId, userId, name) => {
      socket.join(roomId);
      console.log("Joined Room: ", roomId, userId, name);
      socket.to(roomId).emit("user-connected", userId, name);

      socket.on("user-disconnected", (roomId, name) => {
        console.log("User Disconnected: ", roomId, name);
        io.to(roomId).emit("user-disconnect", name);
      });

      socket.on("disconnect", () => {
        console.log(socket.connected, roomId); // false
        io.to(roomId).emit("user-disconnect", name);
      });
    });

    socket.on("send-message", (roomId, message, name, userID) => {
      console.log("message", roomId, message, name);
      io.to(roomId).emit("receive-message", message, name, userID);
    });

    socket.on("request-recording", (roomId) => {
      socket.broadcast.to(roomId).emit("ask-recording", roomId);
    });

    socket.on("start-recording", (roomId) => {
      socket.broadcast.to(roomId).emit("start-recording", roomId);
    });

    socket.on("stop-recording", (roomId) => {
      socket.broadcast.to(roomId).emit("stop-recording");
    });

    socket.on("stop-recording-host", (roomId) => {
      socket.broadcast.to(roomId).emit("stop-recording-host");
    });
  });
};
