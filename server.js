const mongoose = require("mongoose");

const env = require("./config/env");
const app = require("./app");
const { runDataMigrations } = require("./services/dataMigrationService");

mongoose
  .connect(env.mongoUri)
  .then(() => {
    return runDataMigrations();
  })
  .then(() => {
    app.listen(env.port, "0.0.0.0", () => {
      console.log("connected to the db and listening on port", env.port);
    });
  })
  .catch((error) => {
    console.log("Could not connect to database!");
    console.log(error);
  });
