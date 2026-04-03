const Visitor = require("../models/visitor");
const Appointment = require("../models/appointment")
const validateVisitor = require("../utils/Validators")
exports.employeeCreateVisitor = async (req, res) => {
  const { name, email, phone, purpose, date } = req.body;
  try {
    const { isValid, errors } = validateVisitor({name, email, phone});
    if (!isValid) {
      return res.status(400).json({ success:false, error:errors });
    }
    const photo = req.file ? req.file.filename : null;
    const visitor = await Visitor.create({
      name,
      email,
      phone,
      photo,
      hostId: req.user.id
    });

    const appointment = await Appointment.create({
      visitorId: visitor._id,
      hostId: req.user.id,
      purpose,
      visitDate: new Date(date),
      status: "approved"
    });

    res.status(200).json({
      success:true,
      data:appointment
    });
  } catch (error) {
    res.status(500).json({
      success:false,
      error:error.message
    })
  }

};

exports.getAllVisitors = async (req, res) => {
  try {
    const visitors = Visitor.find();

    res.status(200).json({
      success: true,
      data: visitors
    })
  }
  catch (error) {
    res.status(500).json({
      success:false,
      error:error.message
    })
  }
}