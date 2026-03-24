const { sendResponse, createHttpError } = require("../util/http");
const {
  createTrip,
  deleteTripById,
  findTripsByUser,
} = require("../services/tripService");

const removeTrip = async (req, res) => {
  const deletedTrip = await deleteTripById(req.params.id, req.user);

  if (!deletedTrip) {
    throw createHttpError(404, "Trip not found");
  }

  return sendResponse(res, {
    message: "Trip deleted successfully",
  });
};

const getTrips = async (req, res) => {
  const trips = await findTripsByUser(req.user);

  return sendResponse(res, {
    message: "User's Trips Retrieved Successfully!",
    payload: { data: trips },
  });
};

const addTrip = async (req, res) => {
  await createTrip(req.user, req.body);

  return sendResponse(res, {
    message: "Trip saved successfully.",
  });
};

module.exports = {
  addTrip,
  getTrips,
  removeTrip,
};
