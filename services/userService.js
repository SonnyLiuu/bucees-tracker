const { User } = require("../models/userModel");

const findUserById = async (userId) =>
  User.findById(userId).select(
    "_id firstName lastName email picture verified authProvider createdAt updatedAt"
  );

module.exports = {
  findUserById,
};
