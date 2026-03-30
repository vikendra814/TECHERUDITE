const { nanoid } = require("nanoid");
const availabilityRepo = require("../repositories/availability.repository");
const ApiError = require("../utils/ApiError");
const generateSlots = require("../utils/slotGenerator");

const createAvailability = async (dateEntries) => {
  const linkId = nanoid(10);

  const dateSlots = dateEntries.map(({ date, startTime, endTime }) => {
    const slots = generateSlots(startTime, endTime);
    if (!slots.length) {
      throw new ApiError(400, `Cannot generate slots for ${date}. Please check the time range.`);
    }
    return { date, startTime, endTime, slots };
  });

  const dates = dateSlots.map((d) => d.date);
  const uniqueDates = [...new Set(dates)];
  if (uniqueDates.length !== dates.length) {
    throw new ApiError(400, "You have added the same date more than once");
  }

  const availability = await availabilityRepo.createAvailability({ linkId, dateSlots });
  return availability;
};

const getAvailability = async (linkId) => {
  const availability = await availabilityRepo.findByLinkId(linkId);
  if (!availability) {
    throw new ApiError(404, "This booking link does not exist");
  }
  return availability;
};

module.exports = { createAvailability, getAvailability };
