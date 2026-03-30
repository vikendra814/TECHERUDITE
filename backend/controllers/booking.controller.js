const bookingService = require("../services/booking.service");

const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.bookSlot(req.params.linkId, req.body);
    res.status(201).json({ success: true, message: "Appointment booked", data: booking });
  } catch (err) {
    next(err);
  }
};

module.exports = { createBooking };
