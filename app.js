const path = require("path");
const express = require("express");
const cors = require("cors");

const env = require("./config/env");
const authenticateRoutes = require("./routes/authenticate");
const tripRoutes = require("./routes/trip");
const userRoutes = require("./routes/user");
const { createHttpError } = require("./util/http");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

const normalizeOrigin = (origin) => {
  if (!origin) {
    return "";
  }

  return origin.replace(/\/+$/, "");
};

const isLocalDevOrigin = (origin) => {
  try {
    const url = new URL(origin);
    return (
      ["localhost", "127.0.0.1"].includes(url.hostname) &&
      ["3000", "3001"].includes(url.port)
    );
  } catch (error) {
    return false;
  }
};

app.use(
  cors({
    origin(origin, callback) {
      const normalizedOrigin = normalizeOrigin(origin);

      if (
        !origin ||
        env.allowedOrigins.includes(normalizedOrigin) ||
        (!env.isProduction && isLocalDevOrigin(normalizedOrigin))
      ) {
        callback(null, true);
        return;
      }

      callback(
        createHttpError(403, `Origin not allowed by CORS: ${normalizedOrigin}`)
      );
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authenticateRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/user", userRoutes);

if (env.isProduction) {
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
