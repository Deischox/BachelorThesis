const mongoose = require("mongoose");

const SurveySchema = new mongoose.Schema({
  title: {
    type: String,
  },
  json: {
    type: String,
    required: true,
  },
});

const Survey = mongoose.model("Survey", SurveySchema);

module.exports = Survey;
