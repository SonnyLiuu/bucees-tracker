const mongoose = require("mongoose");

const legacyTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
      unique: true,
    },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    collection: "tokens",
  }
);

module.exports = mongoose.model("legacytoken", legacyTokenSchema);
