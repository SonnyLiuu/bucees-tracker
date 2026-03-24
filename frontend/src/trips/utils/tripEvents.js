const TRIPS_CHANGED_EVENT = "trips:changed";

export const emitTripsChanged = () => {
  window.dispatchEvent(new CustomEvent(TRIPS_CHANGED_EVENT));
};

export const subscribeToTripsChanged = (callback) => {
  window.addEventListener(TRIPS_CHANGED_EVENT, callback);

  return () => {
    window.removeEventListener(TRIPS_CHANGED_EVENT, callback);
  };
};
