const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} - ${err.message}`);

  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "Already exists", errors: [] });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid ID format", errors: [] });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  return res.status(500).json({ success: false, message: "Something went wrong", errors: [] });
};

module.exports = errorHandler;
