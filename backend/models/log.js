const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  visitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Visitor",
    required: true
  },
  passId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pass",
    required: true
  },
  checkInTime: Date,
  checkOutTime: Date,

}, { timestamps: true });

module.exports = mongoose.model("Log", logSchema);