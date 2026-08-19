const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

router.post("/add", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:serviceId", async (req, res) => {
  try {
    const reviews = await Review.find({
      serviceId: req.params.serviceId
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;