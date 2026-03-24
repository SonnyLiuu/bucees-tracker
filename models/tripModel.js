const mongoose = require("mongoose");
const Joi = require("joi");

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    email: { type: String, default: null },
    date: { type: Date, required: true, index: true },
    location: { type: String, required: true },
    total: { type: Number, required: true },
    didGas: { type: Boolean, default: false, required: true },
    didBrisket: { type: Boolean, default: false, required: true },
    didDessert: { type: Boolean, default: false, required: true },
    didHomeGood: { type: Boolean, default: false, required: true },
    didOutdoor: { type: Boolean, default: false, required: true },
    didJerky: { type: Boolean, default: false, required: true },
    didColdGrab: { type: Boolean, default: false, required: true },
    didHotGrab: { type: Boolean, default: false, required: true },
    did3rdParty: { type: Boolean, default: false, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("trip", tripSchema);

const validate = (data) => {
  const schema = Joi.object({
    storeNumber: Joi.string().pattern(/^#\d+$/).required().label("Store"),
    date: Joi.alternatives()
      .try(
        Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
        Joi.date().iso()
      )
      .required()
      .label("Trip Date"),
    total: Joi.number().min(0).required().label("Trip Total"),
    didGas: Joi.boolean().optional(),
    didBrisket: Joi.boolean().optional(),
    didDessert: Joi.boolean().optional(),
    didHomeGood: Joi.boolean().optional(),
    didOutdoor: Joi.boolean().optional(),
    didJerky: Joi.boolean().optional(),
    didColdGrab: Joi.boolean().optional(),
    didHotGrab: Joi.boolean().optional(),
    did3rdParty: Joi.boolean().optional(),
  });

  return schema.validate(data);
};

module.exports = { Trip, validate };
