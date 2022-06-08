const express = require("express");
const router = express.Router();
const User = require("../../modules/User");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

module.exports = (app, passport) => {
  // Specify how to serialize User
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Specify how to deserialize User
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // Specify the strategy that passport.js should use
  passport.use(
    new localStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: "Incorrect Username" });

        bcrypt.compare(password, user.password, (err, res) => {
          if (err) return done(err);
          if (res === false) {
            return done(null, false, { message: "Incorrect password." });
          }

          return done(null, user);
        });
      });
    })
  );

  // Gets the username of the logged in user.
  router.get("/user", (req, res) => {
    res.send(req.user);
  });

  // Checks if a user with password and username exist and logs in.
  router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) console.error(err);
      if (!user) res.send("No User Exists");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.send("Successfully Authenticated");
          next();
        });
      }
    })(req, res, next);
  });
  // Checks if the user is logged in.
  router.get("/checkLogin", (req, res) => {
    const authenticated = req.user !== "undefined";
    res.send(authenticated);
  });

  // The currently logged in User get logged out.
  router.post("/logout", (req, res) => {
    req.logout();
    res.send("Logout");
  });

  router.get("/adminAccount", async (req, res) => {
    const exists = await User.exists({ username: "Admin" });
    if (exists) {
      res.send(true);
    } else {
      res.send(false);
    }
  });

  // Creates a new Admin User, if none exists
  router.post("/setup", async (req, res) => {
    const exists = await User.exists({ username: "Admin" });

    if (exists) {
      res.send("Admin User already exist.");
      return;
    }

    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) return next(err);
        const newAdmin = new User({
          username: "Admin",
          password: hash,
        });

        newAdmin.save();

        res.send("New Admin User created.");
      });
    });
  });

  return router;
};
