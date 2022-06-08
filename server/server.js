const express = require("express");
const mongoose = require("mongoose");
const app = express();
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config({ path: "./config/dev.env" });

const emailService = require("./emailService.js");

var server;
if (process.env.HTTPS == "true") {
  var options = {
    key: fs.readFileSync("cloudflareKey.pem"),
    cert: fs.readFileSync("cloudflareCert.pem"),
  };
  server = require("https").createServer(options, app);
} else {
  server = require("http").createServer(app);
}

// express setup
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "500MB", type: "application/json" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "verySafe",
    resave: false,
    saveUninitialized: true,
  })
);
// Passport.js setup
app.use(passport.initialize());
app.use(passport.session());

// initialize API Routes
require("./routes")(app, passport);

//Socket.IO setup
const io = require("socket.io")(server, {
  transports: ["websocket"],
  cors: {
    origin: "*:*",
    methods: ["GET", "POST"],
  },
  path: "/socketIO/", //specify the path under which Socket.IO should run
});

require("./socketio")(io);

//Database Setup
const connectionString = process.env.MONGO_URI;
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((e) => console.log(e));

emailService();

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log("Server is running: " + PORT);
});
