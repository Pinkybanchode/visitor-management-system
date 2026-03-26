const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
    name:{
        type:String
    },
  email:{
        type:String
    },
  phone:{
        type:String
    },
  photo:{
        type:String
    },

  hostId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    }

}, { timestamps: true });
module.exports = mongoose.model("Visitor", visitorSchema);