const mongoose = require("mongoose");

const passSchema = new mongoose.Schema({
  visitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Visitor",
    required: true
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  qrCode: String,
  validFrom: {
    type: Date,
    required: true
  },
  validTo: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  checkInTime: Date,
  checkOutTime: Date,
  visitStatus: {
    type: String,
    enum: ["not-arrived", "checked-in", "checked-out"],
    default: "not-arrived"
  }

}, { timestamps: true });


module.exports = mongoose.model("Pass", passSchema);