const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  path: {
    type: String,
    require: true,
  },
  timestamp: {
    type: String,
    default: Date.now(),
  },
  userID: {
    type: String,
  },
});

const Video = mongoose.model("Video", VideoSchema);

module.exports = Video;
