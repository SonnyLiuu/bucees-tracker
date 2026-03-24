require("dotenv").config();

const Joi = require("joi");

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "test", "production")
    .default("development"),
  PORT: Joi.number().port().default(3001),
  MONGODB_URI: Joi.string().trim().required(),
  JWT_PRIVATE_KEY: Joi.string().trim().allow(""),
  JWTPRIVATEKEY: Joi.string().trim().allow(""),
  BCRYPT_SALT_ROUNDS: Joi.number().integer().min(4).max(31),
  SALT: Joi.number().integer().min(4).max(31),
  APP_BASE_URL: Joi.string().uri({ scheme: ["http", "https"] }).allow(""),
  BASE_URL: Joi.string().uri({ scheme: ["http", "https"] }).allow(""),
  GOOGLE_CLIENT_ID: Joi.string().trim().allow(""),
  EMAIL_SERVICE: Joi.string().trim().allow(""),
  EMAIL_USER: Joi.string().trim().allow(""),
  EMAIL_PASS: Joi.string().trim().allow(""),
  FRONTEND_ORIGIN: Joi.string().uri({ scheme: ["http", "https"] }).allow(""),
  ADDITIONAL_CORS_ORIGINS: Joi.string().trim().allow(""),
}).unknown(true);

const { error, value } = envSchema.validate(process.env, {
  abortEarly: false,
  convert: true,
});

if (error) {
  throw new Error(
    `Invalid environment configuration:\n${error.details
      .map((detail) => `- ${detail.message}`)
      .join("\n")}`
  );
}

const normalizeBaseUrl = (url) => {
  if (!url) {
    return "";
  }

  return `${url.replace(/\/+$/, "")}/`;
};

const normalizeOrigin = (origin) => {
  if (!origin) {
    return "";
  }

  return origin.replace(/\/+$/, "");
};

const jwtPrivateKey = value.JWT_PRIVATE_KEY || value.JWTPRIVATEKEY;
const bcryptSaltRounds = Number(value.BCRYPT_SALT_ROUNDS ?? value.SALT ?? 10);
const appBaseUrl = normalizeBaseUrl(value.APP_BASE_URL || value.BASE_URL);
const googleClientId = value.GOOGLE_CLIENT_ID;

const missingEnv = [];

if (!jwtPrivateKey && value.NODE_ENV !== "test") {
  missingEnv.push("JWT_PRIVATE_KEY");
}

if (!appBaseUrl && value.NODE_ENV !== "test") {
  missingEnv.push("APP_BASE_URL");
}

if (!googleClientId && value.NODE_ENV !== "test") {
  missingEnv.push("GOOGLE_CLIENT_ID");
}

if (value.NODE_ENV === "production") {
  if (!value.EMAIL_SERVICE) {
    missingEnv.push("EMAIL_SERVICE");
  }

  if (!value.EMAIL_USER) {
    missingEnv.push("EMAIL_USER");
  }

  if (!value.EMAIL_PASS) {
    missingEnv.push("EMAIL_PASS");
  }
}

if (missingEnv.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnv.join(", ")}`
  );
}

const allowedOrigins = Array.from(
  new Set(
    [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      value.NODE_ENV === "production"
        ? "https://bucees-tracker.vercel.app"
        : null,
      normalizeOrigin(value.FRONTEND_ORIGIN) || null,
      ...(value.ADDITIONAL_CORS_ORIGINS
        ? value.ADDITIONAL_CORS_ORIGINS.split(",")
            .map((origin) => normalizeOrigin(origin.trim()))
            .filter(Boolean)
        : []),
    ].filter(Boolean)
  )
);

module.exports = Object.freeze({
  nodeEnv: value.NODE_ENV,
  isProduction: value.NODE_ENV === "production",
  port: value.PORT,
  mongoUri: value.MONGODB_URI,
  jwtPrivateKey,
  bcryptSaltRounds,
  appBaseUrl,
  googleClientId,
  emailService: value.EMAIL_SERVICE,
  emailUser: value.EMAIL_USER,
  emailPass: value.EMAIL_PASS,
  allowedOrigins,
});
