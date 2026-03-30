const router = require("express").Router();
const availabilityController = require("../controllers/availability.controller");
const bookingController = require("../controllers/booking.controller");
const validate = require("../middlewares/validation.middleware");
const { generateLinkSchema, bookingSchema } = require("../validations/appointment.validation");

router.post("/availability/generate-link", validate(generateLinkSchema), availabilityController.createAvailability);
router.get("/availability/:linkId", availabilityController.getAvailability);
router.post("/book/:linkId", validate(bookingSchema), bookingController.createBooking);

module.exports = router;
