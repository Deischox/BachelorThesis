var nodemailer = require("nodemailer");
var fs = require("fs");
require("dotenv").config({ path: "./config/dev.env" });

const mongoose = require("mongoose");
const EmailTemplate = require("./modules/EmailTemplate");
const EmailSettings = require("./modules/EmailSettings");

var host = "";
var port = "";
var emailUsername = "";
var emailPassword = "";
var emailFrom = "";
var emailTopic = "";
var adminEmail = "";

const connectToDataBase = async () => {
  return new Promise((resolve, reject) => {
    const connectionString = process.env.MONGO_URI;

    mongoose
      .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => getEmailSettings().then(() => resolve()))
      .catch((e) => reject(e));
  });
};

const getEmailSettings = async () => {
  const emailSettings = await EmailSettings.findOne({ admin: "University" });
  host = emailSettings.emailHost;
  emailUsername = emailSettings.emailUsername;
  emailPassword = emailSettings.emailPassword;
  emailFrom = emailSettings.emailTitleFrom;
  emailTopic = emailSettings.emailTopic;
  adminEmail = emailSettings.adminEmail;
  port = emailSettings.port;
};

// async..await is not allowed in global scope, must use a wrapper
sendMail = (date, email, adminTemplate, participantTemplate, surveys) => {
  connectToDataBase().then(() => {
    let dateFormat = new Date(date).toLocaleString("de-DE");
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: emailUsername, // generated ethereal user
        pass: emailPassword, // generated ethereal password
      },
    });

    //create Email Options
    var mailOptions = {
      from: `${emailFrom} <${emailUsername}>`, // sender address
      to: adminEmail, // list of receivers
      subject: emailTopic, // Subject line
      html: adminTemplate.replace("TIME_SLOT", dateFormat),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return error;
      } else {
        console.log("Email sent to " + adminEmail + ": " + info.response);
        return "Email sent: " + info.response;
      }
    });

    var surveyText = "";
    surveys.forEach((s) => {
      surveyText +=
        "<br> <a href='" +
        process.env.REACT_URL +
        "/survey/" +
        s._id +
        "'>" +
        s.title +
        "</a> ";
    });
    surveyText += "<br>";

    var mailOptions = {
      from: `${emailFrom} <${emailUsername}>`, // sender address
      to: email, // list of receivers
      subject: emailTopic, // Subject line
      html: participantTemplate
        .replace("TIME_SLOT", dateFormat)
        .replace("SURVEYS", surveyText),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return error;
      } else {
        console.log("Email sent to " + email + ": " + info.response);
        return "Email sent: " + info.response;
      }
    });
  });
};

const reminderMail = (surveys, participantTemplate, date, email) => {
  connectToDataBase().then(() => {
    let dateFormat = new Date(date).toLocaleString("de-DE");
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: emailUsername, // generated ethereal user
        pass: emailPassword, // generated ethereal password
      },
    });
    var surveyText = "";
    surveys.forEach((s) => {
      surveyText +=
        "<br> <a href='" +
        process.env.REACT_URL +
        "/survey/" +
        s._id +
        "'>" +
        s.title +
        "</a> ";
    });
    surveyText += "<br>";

    var mailOptions = {
      from: `${emailFrom} <${emailUsername}>`, // sender address
      to: email, // list of receivers
      subject: "Interview Reminder", // Subject line
      html: participantTemplate
        .replace("TIME_SLOT", dateFormat)
        .replace("SURVEYS", surveyText),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return error;
      } else {
        console.log("Email sent to " + email + ": " + info.response);
        return "Email sent: " + info.response;
      }
    });
  });
};

const testEmail = async () => {
  console.log("Testing Mail");
  try {
    await connectToDataBase();

    var msg = "";
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: emailUsername,
        pass: emailPassword,
      },
    });

    var mailOptions = {
      from: `${emailFrom} <${emailUsername}>`, // sender address
      to: adminEmail, // list of receivers
      subject: "TEST EMAIL", // Subject line
      html: "<h1> THIS IS A TEST EMAIL </h1>",
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          msg = error;
          reject(msg);
        } else {
          console.log("Email sent: " + info.response);
          msg = "Email sent: " + info.response;
          resolve(msg);
        }
      });
    }).then((r) => console.log(msg));
  } catch (e) {
    msg = "Mail failed: " + e;
  }
  console.log(msg);
  return msg;
};

module.exports = { sendMail, reminderMail, testEmail };
