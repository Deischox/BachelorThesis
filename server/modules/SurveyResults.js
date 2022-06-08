const mongoose = require("mongoose");

const SurveyResultsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  surveyID: {
    type: String,
  },
  json: {
    type: JSON,
    required: true,
  },
  userID: {
    type: String,
  },
});

const SurveyResults = mongoose.model("SurveyResults", SurveyResultsSchema);

module.exports = SurveyResults;
