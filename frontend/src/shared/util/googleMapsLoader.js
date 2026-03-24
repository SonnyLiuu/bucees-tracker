import { CLIENT_ENV } from "../../config/env";

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-api-script";

let googleMapsPromise;

const createGoogleMapsScript = () => {
  const script = document.createElement("script");

  script.id = GOOGLE_MAPS_SCRIPT_ID;
  script.async = true;
  script.defer = true;
  script.src = `https://maps.googleapis.com/maps/api/js?key=${CLIENT_ENV.googleMapsApiKey}`;

  return script;
};

export const loadGoogleMapsApi = () => {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.google?.maps) {
    return Promise.resolve(true);
  }

  if (!CLIENT_ENV.googleMapsApiKey) {
    return Promise.resolve(false);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
    const script = existingScript || createGoogleMapsScript();

    const handleLoad = () => resolve(Boolean(window.google?.maps));
    const handleError = () => {
      googleMapsPromise = undefined;
      reject(new Error("Failed to load Google Maps API"));
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      document.head.appendChild(script);
    }
  });

  return googleMapsPromise;
};
