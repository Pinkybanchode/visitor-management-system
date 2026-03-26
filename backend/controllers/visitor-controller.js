const Visitor = require("../models/visitor");
const Appointment = require("../models/appointment")
exports.employeeCreateVisitor = async (req, res) => {
  const { name, email, phone, purpose, date } = req.body;

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

  res.json({
    visitor,
    appointment
  });
};
