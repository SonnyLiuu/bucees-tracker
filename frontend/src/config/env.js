const requiredClientEnvKeys =
  process.env.NODE_ENV === "test" ? [] : ["REACT_APP_GOOGLE_CLIENT_ID"];

const missingClientEnvKeys = requiredClientEnvKeys.filter(
  (key) => !process.env[key]
);

if (missingClientEnvKeys.length > 0) {
  throw new Error(
    `Missing required client environment variables: ${missingClientEnvKeys.join(
      ", "
    )}`
  );
}

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const defaultApiBase =
  process.env.NODE_ENV === "production"
    ? "https://bucees-tracker.onrender.com"
    : "http://localhost:3001";

export const CLIENT_ENV = Object.freeze({
  apiBase: trimTrailingSlash(process.env.REACT_APP_API_BASE || defaultApiBase),
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
});
