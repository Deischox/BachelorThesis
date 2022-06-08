const mongoose = require("mongoose");

const EmailSettingsSchema = new mongoose.Schema({
  
  admin: {
    type: String,
  },
  emailHost: {
    type: String,
  },
  emailUsername: {
    type: String,
  },
  emailPassword: {
    type: String
  },
  emailTitleFrom: {
    type: String
  },
  adminEmail: {
    type: String
  },
  emailTopic: {
    type: String
  },
  port: {
    type: String
  }
});

const EmailSettings = mongoose.model("EmailSettings", EmailSettingsSchema);

module.exports = EmailSettings;
