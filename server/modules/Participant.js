const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
  ParticipantId: {
    type: String,
    required: true,
  },
  Age: {
    type: String,
  },
  Gender: {
    type: String,
  },
  Nationality: {
    type: String,
  },
  Email: {
    type: String,
  },
  Consent: {
    type: String,
  },
});

const Participant = mongoose.model("Participant", ParticipantSchema);

module.exports = Participant;
