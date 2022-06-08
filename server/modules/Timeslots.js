const mongoose = require("mongoose");

const TimeslotSchema = new mongoose.Schema({
  start: {
    type: Number,
    required: true,
  },
  end: {
    type: Number,
    required: true,
  },
});

const Timeslot = mongoose.model("Timeslot", TimeslotSchema);

module.exports = Timeslot;
