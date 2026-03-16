require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authenticateRoutes = require("./routes/authenticate");
const tripRoutes = require("./routes/trip");
const userRoutes = require("./routes/user");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://bucees-tracker.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authenticateRoutes);
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
