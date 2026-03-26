const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    visitorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Visitor",
    },
    hostId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },
    purpose:{
        type:String
    },
  visitDate:{
        type:String
    },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  passId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Pass",
  default: null
},

isPassIssued: {
  type: Boolean,
  default: false
}

}, { timestamps: true });
module.exports = mongoose.model("Appointment", appointmentSchema);