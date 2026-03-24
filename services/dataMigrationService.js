const { User } = require("../models/userModel");
const { Trip } = require("../models/tripModel");
const LegacyToken = require("../models/legacyTokenModel");
const VerificationToken = require("../models/verificationTokenModel");
const PasswordResetToken = require("../models/passwordResetTokenModel");
const { normalizeTripDate } = require("../util/tripDate");

const logPrefix = "[data-migration]";

const buildTimestampUpdate = (document) => {
  const fallbackDate = document._id.getTimestamp();
  const createdAt = document.createdAt || fallbackDate;
  const updatedAt = document.updatedAt || createdAt;

  return {
    createdAt,
    updatedAt,
  };
};

const backfillUserTimestamps = async () => {
  const users = await User.find({
    $or: [{ createdAt: { $exists: false } }, { updatedAt: { $exists: false } }],
  });

  if (users.length === 0) {
    return 0;
  }

  const operations = users.map((user) => ({
    updateOne: {
      filter: { _id: user._id },
      update: { $set: buildTimestampUpdate(user) },
    },
  }));

  await User.bulkWrite(operations);
  return users.length;
};

const buildTripMigrationUpdate = async (trip, userCache) => {
  let ownerId = trip.userId || null;

  if (!ownerId && trip.email) {
    if (!userCache.has(trip.email)) {
      userCache.set(trip.email, await User.findOne({ email: trip.email }).select("_id"));
    }

    ownerId = userCache.get(trip.email)?._id || null;
  }

  const normalizedDate = normalizeTripDate(trip.date);

  if (!ownerId || !normalizedDate) {
    return null;
  }

  return {
    userId: ownerId,
    date: normalizedDate,
    ...buildTimestampUpdate(trip),
  };
};

const backfillTrips = async () => {
  const trips = await Trip.find({
    $or: [
      { userId: { $exists: false } },
      { createdAt: { $exists: false } },
      { updatedAt: { $exists: false } },
    ],
  });

  const userCache = new Map();
  const operations = [];

  for (const trip of trips) {
    const update = await buildTripMigrationUpdate(trip, userCache);

    if (!update) {
      continue;
    }

    operations.push({
      updateOne: {
        filter: { _id: trip._id },
        update: { $set: update },
      },
    });
  }

  if (operations.length === 0) {
    return 0;
  }

  await Trip.bulkWrite(operations);
  return operations.length;
};

const pickTokenModel = (tokenValue) =>
  tokenValue.length <= 10 ? VerificationToken : PasswordResetToken;

const migrateLegacyTokens = async () => {
  const legacyTokens = await LegacyToken.find({});

  if (legacyTokens.length === 0) {
    return 0;
  }

  for (const legacyToken of legacyTokens) {
    const TokenModel = pickTokenModel(legacyToken.token);

    await TokenModel.findOneAndUpdate(
      { userId: legacyToken.userId },
      {
        token: legacyToken.token,
        createdAt: legacyToken.createdAt || legacyToken._id.getTimestamp(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
  }

  await LegacyToken.deleteMany({});
  return legacyTokens.length;
};

const runDataMigrations = async () => {
  const [userCount, tripCount, tokenCount] = await Promise.all([
    backfillUserTimestamps(),
    backfillTrips(),
    migrateLegacyTokens(),
  ]);

  console.log(
    `${logPrefix} users=${userCount} trips=${tripCount} legacyTokens=${tokenCount}`
  );
};

module.exports = {
  runDataMigrations,
};
