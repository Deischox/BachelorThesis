const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  slot: {
    type: Number,
  },
  user: {
    type: String,
  },
  email: {
    type: String,
  },
  offset: {
    type: Number,
  },
});

const Interview = mongoose.model("Interview", InterviewSchema);

module.exports = Interview;
