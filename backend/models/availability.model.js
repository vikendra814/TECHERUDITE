const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
});

const dateSlotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  slots: [slotSchema],
});

const availabilitySchema = new mongoose.Schema(
  {
    linkId: { type: String, required: true, unique: true },
    dateSlots: [dateSlotSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Availability", availabilitySchema);
