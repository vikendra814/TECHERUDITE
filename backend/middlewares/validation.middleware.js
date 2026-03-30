const ApiError = require("../utils/ApiError");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (!error) return next();

  const errors = error.details.map((d) => ({
    field: String(d.path[d.path.length - 1]),
    message: d.message.replace(/['"]/g, ""),
  }));

  next(new ApiError(400, "Validation failed", errors));
};

module.exports = validate;
