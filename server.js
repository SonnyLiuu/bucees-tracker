require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authenticateRoutes = require("./routes/authenticate");
const tripRoutes = require("./routes/trip");
const userRoutes = require("./routes/user");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://bucees-buddy.vercel.app/"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", authenticateRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/user", userRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

const port = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log("connected to the db and listening on port", port);
    });
  })
  .catch((error) => {
    console.log("Could not connect to database!");
    console.log(error);
  });
