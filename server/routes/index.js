module.exports = (app, passport) => {
  // API routes

  var loginRoutes = require("./api/login.js")(app, passport);
  app.use("/v1", loginRoutes);

  var adminRoutes = require("./api/admin.js")(app);
  app.use("/v1", adminRoutes);

  var utilsRoute = require("./api/utils.js")(app);
  app.use("/v1", utilsRoute);
};
