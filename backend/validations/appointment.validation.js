const Joi = require("joi");

const toMins = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const dateSlotSchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .custom((value, helpers) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(value) < today) return helpers.error("any.invalid");
      return value;
    })
    .messages({
      "string.empty": "Date is required",
      "string.pattern.base": "Invalid date format",
      "any.invalid": "Date cannot be in the past",
    }),
  startTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.empty": "Start time is required",
      "string.pattern.base": "Invalid start time",
    }),
  endTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.empty": "End time is required",
      "string.pattern.base": "Invalid end time",
    }),
}).custom((obj, helpers) => {
  if (toMins(obj.startTime) >= toMins(obj.endTime))
    return helpers.error("any.invalid");
  if (toMins(obj.endTime) - toMins(obj.startTime) < 30)
    return helpers.error("any.invalid");
  return obj;
}).messages({
  "any.invalid": "End time must be after start time and at least 30 minutes apart",
});

const generateLinkSchema = Joi.object({
  dateEntries: Joi.array().items(dateSlotSchema).min(1).required().messages({
    "array.min": "Add at least one date",
    "any.required": "dateEntries is required",
  }),
});

const bookingSchema = Joi.object({
  dateSlotId: Joi.string().required().messages({ "string.empty": "dateSlotId is required" }),
  slotId: Joi.string().required().messages({ "string.empty": "slotId is required" }),
  guestName: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
  }),
  guestEmail: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "Email is required",
    "string.email": "Enter a valid email",
  }),
});

module.exports = { generateLinkSchema, bookingSchema };
