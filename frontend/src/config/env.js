const requiredClientEnvKeys =
  import.meta.env.MODE === "test" ? [] : ["VITE_GOOGLE_CLIENT_ID"];

const missingClientEnvKeys = requiredClientEnvKeys.filter(
  (key) => !import.meta.env[key]
);

if (missingClientEnvKeys.length > 0) {
  throw new Error(
    `Missing required client environment variables: ${missingClientEnvKeys.join(
      ", "
    )}`
  );
}

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const defaultApiBase = "";

export const CLIENT_ENV = Object.freeze({
  apiBase: trimTrailingSlash(import.meta.env.VITE_API_BASE || defaultApiBase),
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
});
