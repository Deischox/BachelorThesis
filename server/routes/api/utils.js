const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const Participant = require("../../modules/Participant");

// Index of API
router.get("/", (req, res) => {
  res.send("Server is running");
});

// Create a new video file on the server of append data to a existing one
router.post("/recordVideo", (req, res) => {
  const participant = Participant.findOneAndUpdate(
    { ParticipantId: req.body.filename },
    {
      $set: {
        ParticipantId: req.body.filename,
      },
    },
    { upsert: true },
    (err, doc) => {
      if (err) {
        console.log("error", err);
      }
    }
  );
  try {
    const data = req.body.data;
    const filename = req.body.filename;
    const dataBuffer = new Buffer(data, "base64");
    const fileStream = fs.createWriteStream(
      path.resolve("./videos/" + filename + ".mp4"),
      {
        flags: "a",
      }
    );
    fileStream.write(dataBuffer);
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false });
  }
});

module.exports = (app) => {
  return router;
};
