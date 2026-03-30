const availabilityService = require("../services/availability.service");

const createAvailability = async (req, res, next) => {
  try {
    const availability = await availabilityService.createAvailability(req.body.dateEntries);
    res.status(201).json({
      success: true,
      message: "Booking link created",
      data: {
        linkId: availability.linkId,
        bookingUrl: `${process.env.FRONTEND_URL}/book/${availability.linkId}`,
        dateSlots: availability.dateSlots,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAvailability = async (req, res, next) => {
  try {
    const availability = await availabilityService.getAvailability(req.params.linkId);
    res.status(200).json({ success: true, message: "success", data: availability });
  } catch (err) {
    next(err);
  }
};

module.exports = { createAvailability, getAvailability };
