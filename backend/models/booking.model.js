const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    availabilityId: { type: mongoose.Schema.Types.ObjectId, ref: "Availability", required: true },
    dateSlotId: { type: mongoose.Schema.Types.ObjectId, required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, required: true },
    guestName: { type: String, required: true, trim: true },
    guestEmail: { type: String, required: true, trim: true, lowercase: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { timestamps: true }
);

bookingSchema.index({ availabilityId: 1, slotId: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);
