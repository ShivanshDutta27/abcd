const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

router.post("/add", async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { location, category, minPrice, maxPrice } = req.query;

    let filter = {};

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i" // ✅ case-insensitive
      };
    }

    if (category) {
      filter.category = {
        $regex: category,
        $options: "i"
      };
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const services = await Service.find(filter);
    res.json(services);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/vendor/:id", async (req, res) => {
  try {
    const services = await Service.find({ owner: req.params.id });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;