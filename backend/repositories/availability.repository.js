const Availability = require("../models/availability.model");

const createAvailability = async (data) => {
  return await Availability.create(data);
};

const findByLinkId = async (linkId) => {
  return await Availability.findOne({ linkId });
};

const markSlotBooked = async (linkId, dateSlotId, slotId) => {
  return await Availability.findOneAndUpdate(
    { linkId, "dateSlots._id": dateSlotId, "dateSlots.slots._id": slotId },
    { $set: { "dateSlots.$[ds].slots.$[sl].isBooked": true } },
    {
      arrayFilters: [{ "ds._id": dateSlotId }, { "sl._id": slotId }],
      new: true,
    }
  );
};

module.exports = { createAvailability, findByLinkId, markSlotBooked };
