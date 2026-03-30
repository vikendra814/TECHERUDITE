require("dotenv").config();
const express = require("express");
const cors = require("cors");
const appointmentRoutes = require("./routes/appointment.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use("/api/v1", appointmentRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

module.exports = app;
