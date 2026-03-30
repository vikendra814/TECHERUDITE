const mongoose = require("mongoose");
const availabilityRepo = require("../repositories/availability.repository");
const bookingRepo = require("../repositories/booking.repository");
const ApiError = require("../utils/ApiError");

const bookSlot = async (linkId, { dateSlotId, slotId, guestName, guestEmail }) => {
  const availability = await availabilityRepo.findByLinkId(linkId);
  if (!availability) {
    throw new ApiError(404, "This booking link does not exist");
  }

  const dateSlot = availability.dateSlots.find((ds) => ds._id.toString() === dateSlotId);
  if (!dateSlot) {
    throw new ApiError(404, "Date not found");
  }

  const slot = dateSlot.slots.find((s) => s._id.toString() === slotId);
  if (!slot) {
    throw new ApiError(404, "Slot not found");
  }

  if (slot.isBooked) {
    throw new ApiError(409, "This slot is already booked, please pick another one");
  }

  const alreadyBooked = await bookingRepo.findExistingBooking(availability._id, slotId);
  if (alreadyBooked) {
    throw new ApiError(409, "This slot is already booked, please pick another one");
  }

  try {
    const booking = await bookingRepo.createBooking({
      availabilityId: availability._id,
      dateSlotId: new mongoose.Types.ObjectId(dateSlotId),
      slotId: new mongoose.Types.ObjectId(slotId),
      guestName,
      guestEmail,
      date: dateSlot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });

    await availabilityRepo.markSlotBooked(linkId, dateSlotId, slotId);

    return booking;
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(409, "This slot is already booked, please pick another one");
    }
    throw err;
  }
};

module.exports = { bookSlot };
