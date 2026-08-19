const mongoose = require("mongoose");
const vendorRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  businessName: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  images: {
    type: [String],
    default:[]
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }

}, { timestamps: true });
module.exports = mongoose.model("VendorRequest", vendorRequestSchema);