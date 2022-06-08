const fs = require("fs");
var path = require("path");
const SurveyResults = require("../../modules/SurveyResults");
const express = require("express");
const router = express.Router();

const Video = require("../../modules/Video");
const Interview = require("../../modules/Interview");
const Timeslot = require("../../modules/Timeslots");
const Survey = require("../../modules/Survey");
const Participant = require("../../modules/Participant");
const EmailTemplate = require("../../modules/EmailTemplate");
const EmailSettings = require("../../modules/EmailSettings");
const { sendMail, testEmail } = require("../../mail");

// get all videos
router.get("/videos", async (req, res) => {
  if (req.user) {
    const videos = await Video.find();
    res.json(videos);
  } else {
    res.status(401);
  }
});

// check if a video with that name already exists
router.get("/video/:name", async (req, res) => {
  const exists = fs.existsSync(
    path.resolve("./videos/" + req.params.name + ".mp4")
  );
  res.json(exists);
});

// download a video
router.get("/videos/download/:name", async (req, res) => {
  if (req.user) {
    const rs = fs.createReadStream(
      path.resolve("./videos/" + req.params.name + ".mp4")
    );
    res.setHeader("Content-Disposition", `attachment; ${req.params.name}.mp4`);
    rs.pipe(res);
  } else {
    res.status(401);
  }
});

// delete a video entry
router.post("/videos/:id/delete", async (req, res) => {
  if (req.user) {
    const video = await Video.findById(req.params.id);
    fs.unlink(path.resolve("./videos/" + video.title + ".mp4"), (err, data) => {
      if (err) {
        console.log(err);
      }
      video.remove();
    });
    res.send("Success");
  } else {
    res.status(401);
  }
});

// create a new video entry
router.post("/video/new", (req, res) => {
  const video = new Video({
    title: req.body.title,
    path: req.body.path,
    userID: req.body.userID,
  });

  video.save();

  res.json(video);
});

// send a video file to the user
router.get("/video/watch/:name", async (req, res) => {
  if (req.user) {
    res.sendFile(path.resolve("./videos/" + req.params.name + ".mp4"));
  } else {
    res.status(401);
  }
});

// set new interview
router.post("/setInterview", async (req, res) => {
  const adminTemplate = await EmailTemplate.findOne({ for: "Admin" });
  const participantTemplate = await EmailTemplate.findOne({
    for: "Participant",
  });

  const surveys = [];
  if (participantTemplate) {
    const surv = participantTemplate.surveys.map(async (s) => {
      const survey = await Survey.findOne({ title: s });
      surveys.push(survey);
    });
    Promise.all(surv).then(() => {
      if (participantTemplate && adminTemplate) {
        sendMail(
          new Date(req.body.date).setMinutes(
            new Date(req.body.date).getMinutes() - req.body.offset
          ),
          req.body.email,
          adminTemplate.text,
          participantTemplate.text,
          surveys
        );
      }

      try {
        const interview = new Interview({
          date: req.body.date,
          slot: req.body.slot,
          user: req.body.user,
          email: req.body.email,
          offset: req.body.offset,
        });
        interview.save();
        res.json(interview);
      } catch {
        res.json("Error");
      }
    });
  }
});

// get all booked interviews
router.get("/getInterviews", async (req, res) => {
  if (req.user) {
    const interviews = await Interview.find();
    res.json(interviews);
  } else {
    res.status(401);
  }
});

// get the booked interview of a user
router.get("/getUserInterview", async (req, res) => {
  const interview = await Interview.findOne({ user: req.query.user });

  if (interview) {
    if (interview.date >= new Date()) {
      res.send(interview);
    } else {
      res.send({});
    }
  } else {
    res.send({});
  }
});

// get all booked time slots
router.get("/getBookedSlots", async (req, res) => {
  const bookedSlots = await Interview.aggregate([
    { $group: { _id: { slot: "$slot", date: "$date" } } },
  ]);
  var now = new Date();
  /*
  var next_week_start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + (8 - now.getDay())
  );
  Interview.deleteMany({ date: { $lt: next_week_start } }).exec();
  */
  res.send(bookedSlots);
});

// Set new time slots
router.post("/setTimes", async (req, res) => {
  if (req.user) {
    const slot = new Timeslot({
      start: req.body.start,
      end: req.body.end,
    });
    slot.save();
    res.json(slot);
  } else {
    res.status(401);
  }
});

// Delete all time slots
router.post("/deleteTimes", async (req, res) => {
  if (req.user) {
    Timeslot.deleteMany({}).exec();
    res.json("SUCCESS");
  } else {
    res.status(401);
  }
});

// Get all time slots
router.get("/slots", async (req, res) => {
  const slots = await Timeslot.find();
  res.json(slots);
});

// Create or update survey
router.post("/setSurvey", async (req, res) => {
  if (req.user) {
    Survey.exists({ _id: req.body.id }).then((exists) => {
      if (exists) {
        Survey.findByIdAndUpdate(
          req.body.id,
          { $set: { json: req.body.json, title: req.body.title } },
          { new: true },
          (err, doc) => {
            if (err) {
              console.log(err);
            }
          }
        );
      } else {
        const survey = new Survey({
          json: req.body.json,
          title: req.body.title,
        });
        survey.save();
      }
    });

    res.json("Success");
  } else {
    res.status(401);
  }
});

//get all surveys
router.get("/getSurveys", async (req, res) => {
  const survey = await Survey.find();
  res.json(survey);
});

// get one survey
router.get("/getSurvey", async (req, res) => {
  const survey = await Survey.findById(req.query.id);
  res.json(survey);
});

// delete a Survey
router.post("/deleteSurvey", async (req, res) => {
  if (req.user) {
    //Edit Email Template if Survey exist in them

    const template = await EmailTemplate.findOne({ for: "Participant" });
    const survey = await Survey.findById(req.body.id);

    if (template.surveys.includes(survey.title)) {
      await EmailTemplate.updateOne(
        { for: "Participant" },
        { $pull: { surveys: survey.title } }
      );
    }
    survey.delete();

    res.json(survey);
  } else {
    res.status(401);
  }
});

// create a new Survey result
router.post("/setSurveyResults", (req, res) => {
  const participant = Participant.findOneAndUpdate(
    { ParticipantId: req.body.userID },
    {
      $set: {
        ParticipantId: req.body.userID,
      },
    },
    { upsert: true },
    (err, doc) => {
      if (err) {
        console.log("error", err);
      }
    }
  );
  const result = new SurveyResults({
    title: req.body.title,
    userID: req.body.userID,
    json: req.body.json,
    surveyID: req.body.surveyID,
  });
  result.save();
  res.json("Success");
});

router.post("/deleteSurveyResult", async (req, res) => {
  const survey = await SurveyResults.findById(req.body.id);
  survey.remove();
  res.send("Deleted");
});

// Get all survey Results
router.get("/getSurveyResults", async (req, res) => {
  if (req.user) {
    const results = await SurveyResults.find();
    res.json(results);
  } else {
    res.status(401);
  }
});

// Get all survey results of a specific survey
router.get("/getSurveyResults/:id", async (req, res) => {
  if (req.user) {
    const results = await SurveyResults.find({ surveyID: req.params.id });
    res.json(results);
  } else {
    res.status(401);
  }
});

// Create a new Participant or update the old data
router.post("/createParticipant", (req, res) => {
  const participant = Participant.findOneAndUpdate(
    { ParticipantId: req.body.ParticipantId },
    {
      $set: {
        ParticipantId: req.body.ParticipantId,
        Age: req.body.Age,
        Gender: req.body.Gender,
        Nationality: req.body.Nationality,
        Consent: req.body.Consent,
        Email: req.body.Email,
      },
    },
    { upsert: true },
    (err, doc) => {
      if (err) {
        console.log("error", err);
      }
    }
  );
  res.send("Success");
});

// Get all Participants
router.get("/getParticipants", async (req, res) => {
  if (req.user) {
    const participants = await Participant.find();
    res.json(participants);
  } else {
    res.status(401);
  }
});

//Email settings
router.get("/getEmailTemplates", async (req, res) => {
  if (req.user) {
    const emailTemplates = await EmailTemplate.find();
    res.json(emailTemplates);
  } else {
    res.status(401);
  }
});

router.post("/setEmailTemplate", async (req, res) => {
  if (req.user) {
    const template = EmailTemplate.findOneAndUpdate(
      { for: req.body.for },
      {
        $set: {
          text: req.body.text,
          surveys: req.body.surveys,
        },
      },
      { upsert: true },
      (err, doc) => {
        if (err) {
          res.json(err);
        }
        res.json(doc);
      }
    );
  } else {
    res.status(401);
  }
});

router.post("/setEmailSettings", async (req, res) => {
  if (req.user) {
    const settings = EmailSettings.findOneAndUpdate(
      { admin: "University" },
      {
        $set: {
          emailHost: req.body.emailHost,
          emailUsername: req.body.emailUsername,
          emailPassword: req.body.emailPassword,
          emailTitleFrom: req.body.emailTitleFrom,
          adminEmail: req.body.adminEmail,
          emailTopic: req.body.emailTopic,
          port: req.body.port,
        },
      },
      { upsert: true },
      (err, doc) => {
        if (err) {
          res.json(err);
        }
        res.json(doc);
      }
    );
  }
});

router.get("/getEmailSettings", async (req, res) => {
  if (req.user) {
    const emailSettings = await EmailSettings.find({ admin: "University" });
    res.json(emailSettings);
  } else {
    res.status(401);
  }
});

router.get("/sendTestMail", async (req, res) => {
  if (req.user) {
    const msg = await testEmail();
    res.json(msg);
  } else {
    res.status(401);
  }
});

module.exports = (app) => {
  return router;
};
