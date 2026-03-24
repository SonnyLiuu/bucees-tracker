const mongoose = require("mongoose");

const { Trip, validate } = require("../models/tripModel");
const { findStore } = require("../data/storeCatalog");
const { createHttpError } = require("../util/http");
const { normalizeTripDate } = require("../util/tripDate");

const validatePayloadOrThrow = (payload) => {
  const validationResult = validate(payload);

  if (validationResult.error) {
    throw createHttpError(400, validationResult.error.details[0].message);
  }
};

const buildTripOwnershipQuery = (user) => {
  const or = [{ userId: user._id }];

  if (user.email) {
    or.push({ email: user.email });
  }

  return { $or: or };
};

const listTripsByUser = async (user) =>
  Trip.find(buildTripOwnershipQuery(user)).sort({ date: -1, createdAt: -1 });

const findTripsByUser = async (user) => {
  const trips = await listTripsByUser(user);

  if (!trips || trips.length === 0) {
    throw createHttpError(404, "No trips found for the user.");
  }

  return trips;
};

const deleteTripById = async (tripId, user) => {
  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    throw createHttpError(400, "Invalid trip id.");
  }

  const trip = await Trip.findById(tripId);

  if (!trip) {
    return null;
  }

  const ownsTrip =
    trip.userId?.toString() === user._id.toString() ||
    (!trip.userId && trip.email && trip.email === user.email);

  if (!ownsTrip) {
    throw createHttpError(403, "You do not have access to this trip.");
  }

  await trip.deleteOne();
  return trip;
};

const createTrip = async (user, payload) => {
  validatePayloadOrThrow(payload);

  const tripDate = normalizeTripDate(payload.date);

  if (!tripDate) {
    throw createHttpError(400, "Invalid trip date.");
  }

  const store = findStore({
    storeNumber: payload.storeNumber,
    location: payload.location,
  });

  if (!store) {
    throw createHttpError(400, "Invalid trip location.");
  }

  return new Trip({
    userId: user._id,
    location: store.name,
    date: tripDate,
    total: payload.total,
    didGas: payload.didGas,
    didBrisket: payload.didBrisket,
    didDessert: payload.didDessert,
    didHomeGood: payload.didHomeGood,
    didOutdoor: payload.didOutdoor,
    didJerky: payload.didJerky,
    didColdGrab: payload.didColdGrab,
    didHotGrab: payload.didHotGrab,
    did3rdParty: payload.did3rdParty,
    latitude: store.lat,
    longitude: store.lng,
  }).save();
};

module.exports = {
  buildTripOwnershipQuery,
  createTrip,
  deleteTripById,
  findTripsByUser,
  listTripsByUser,
};
