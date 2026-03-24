const mongoose = require("mongoose");

const passwordResetTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
      unique: true,
    },
    token: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

passwordResetTokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }
);

module.exports = mongoose.model(
  "passwordresettoken",
  passwordResetTokenSchema
);
