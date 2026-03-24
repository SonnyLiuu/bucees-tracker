const { sendResponse } = require("../util/http");
const { findUserById } = require("../services/userService");
const { getUserAnalytics } = require("../services/analyticsService");

const getCurrentUser = async (req, res) => {
  const userData = await findUserById(req.user._id);
  const analytics = await getUserAnalytics(req.user);

  return sendResponse(res, {
    message: "Login Successful!",
    payload: { userData, analytics },
  });
};

module.exports = {
  getCurrentUser,
};
