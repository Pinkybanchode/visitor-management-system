const Appointment = require("../models/appointment");
const Visitor = require("../models/visitor")
const User = require("../models/user")
const { sendSMS } = require("../utils/Notifications");
const {validateVisitor} = require("../utils/Validators")
exports.createAppointment = async (req, res) => {
  console.log("appt creation post call");
  try {
    const {
      visitorName,
      visitorEmail,
      visitorPhone,
      hostEmail,
      purpose,
      date
    } = req.body;

    const host = await User.findOne({ email: hostEmail });

    if (!host) {
      return res.status(404).json({
        success:false,
        error: "Host not found",
      });
    }

    const photo = req.file ? req.file.filename : null;
    const { isValid, errors } = validateVisitor({name:visitorName, email:visitorEmail, phone:visitorPhone});
    if (!isValid) {
      return res.status(400).json({ success:false, error:errors });
    }
    const visitor = await Visitor.create({
      name: visitorName,
      email: visitorEmail,
      phone: visitorPhone,
      photo,
      hostId: host._id
    });

    const appointment = await Appointment.create({
      visitorId: visitor._id,
      hostId: host._id,
      purpose,
      visitDate: new Date(date),
      status: "pending",
    });
    
    // await sendSMS({
    //   to: `+91${visitor.phone}`,
    //   message:`Hello ${visitor.name}, Your Appointment created successfully`
    // })

    res.status(200).json({
      success:true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success:false,
      error: error.message,
    });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const employeeId = req.user.id;
    console.log(employeeId)
    const appointments = await Appointment.find({
      hostId: employeeId,
      status: "pending",
    })
      .populate("visitorId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success:true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success:false,
      error: error.message,
    });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appt = await Appointment.findById(req.params.id);

    if (appt.hostId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    appt.status = status;
    await appt.save();

    res.status(200).json({
      success:true,
      data: appt
    });
  } catch (error) {
    res.status(500).json({ success:false, error: error.message });
  }
};

exports.getApprovedAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      status: "approved",
      isPassIssued: false
    })
      .populate("visitorId", "name email phone photo")
      .populate("hostId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};