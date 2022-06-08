const mongoose = require("mongoose");

const EmailTemplateSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  for: {
    type: String,
    required: true,
  },
  surveys: {
    type: Array
  }
});

const EmailTemplate = mongoose.model("EmailTemplate", EmailTemplateSchema);

module.exports = EmailTemplate;
