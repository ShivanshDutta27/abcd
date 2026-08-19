const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const Service = require("../models/Service");
const {verifyToken,verifyAdmin} = require("../middleware/auth");

router.post("/add", async (req, res) => {
  try {
    const { serviceId, name, phone, message, userId } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const booking = new Booking({
      serviceId,
      userId,
      vendorId: service.owner,
      name,
      phone,
      message
    });

    await booking.save();

    res.json({ message: "Booking created" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get("/vendor/:id", async (req, res) => {
  try {
    const bookings = await Booking.find({
      vendorId: req.params.id
    }).populate("serviceId");

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/service/:serviceId", async (req, res) => {
  try {
    const bookings = await Booking.find({
      serviceId: req.params.serviceId
    });

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/all", verifyToken,verifyAdmin,async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("serviceId")
      .populate("userId")
      .populate("vendorId");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;