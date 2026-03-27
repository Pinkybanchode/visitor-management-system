const Appointment = require("../models/appointment");
const Visitor = require("../models/visitor")
const User = require("../models/user")
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
        message: "Host not found",
      });
    }

    const photo = req.file ? req.file.filename : null;
    let visitor = await Visitor.findOne({ email });

    if (!visitor) {
     visitor = await Visitor.create({
      name: visitorName,
      email: visitorEmail,
      phone: visitorPhone,
      photo,
      hostId: host._id
    });
    }
    const appointment = await Appointment.create({
      visitorId: visitor._id,
      hostId: host._id,
      purpose,
      visitDate: new Date(date),
      status: "pending",
    });

    res.status(201).json({
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({
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

    res.json({
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
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

    res.json({
      data: appt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    res.json({
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
