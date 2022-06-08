const schedule = require("node-schedule");
const mongoose = require("mongoose");
const Interview = require("./modules/Interview");
const EmailTemplate = require("./modules/EmailTemplate");
const Survey = require("./modules/Survey");
const { reminderMail } = require("./mail");
const universe = () => {
  connectToDataBase();
};

const connectToDataBase = () => {
  const connectionString = process.env.MONGO_URI;

  mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => checkForInterviews())
    .catch((e) => console.log(e));
};

const checkForInterviews = async () => {
  const interviews = await Interview.find();

  interviews.forEach(async (i) => {
    if (isTomorrow(i.date) || isToday(i.date)) {
      const reminderMailTemplate = await EmailTemplate.findOne({
        for: "Reminder",
      });
      const participantTemplate = await EmailTemplate.findOne({
        for: "Participant",
      });

      const surveys = [];
      await Promise.all(
        participantTemplate.surveys.map(async (s) => {
          const survey = await Survey.findOne({ title: s });
          surveys.push(survey);
        })
      );
      reminderMail(
        surveys,
        reminderMailTemplate.text,
        new Date(
          new Date(i.date).setMinutes(new Date(i.date).getMinutes() - i.offset)
        ),
        i.email
      );
    }
  });
};

const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

function isTomorrow(date) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (tomorrow.toDateString() === date.toDateString()) {
    return true;
  }
  return false;
}

module.exports = () => {
  const job = schedule.scheduleJob("0 0 0 * * *", function () {
    universe();
  });
};
