const Booking = require("../models/booking.model");

const createBooking = async (data) => {
  return await Booking.create(data);
};

const findExistingBooking = async (availabilityId, slotId) => {
  return await Booking.findOne({ availabilityId, slotId });
};

module.exports = { createBooking, findExistingBooking };
