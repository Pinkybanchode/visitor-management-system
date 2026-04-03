const Pass = require("../models/pass");
const Log = require("../models/log");
const Visitor = require("../models/visitor");
const QRCode = require("qrcode");
const Appointment = require("../models/appointment");
const User = require("../models/user")
const { sendPassEmail } = require("../utils/Notifications");
const PDFDocument = require("pdfkit");
const validateVisitor = require("../utils/Validators")
exports.issuePass = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    console.log(" " + req.params.id);

    let visitor;
    const appointment = await Appointment.findById(appointmentId);
    console.log(appointment.status)
    if (!appointment) {
      return res.status(404).json({ success:false, error: "Appointment not found" });
    }

    if (appointment.status !== "approved") {
      return res.status(400).json({
        success:false,
        error: "Appointment not approved yet",
      });
    }

    visitor = await Visitor.findById(appointment.visitorId);
    if (!visitor) {
      return res.status(404).json({
        success:false,
        error: "Visitor not found",
      });
    }

    const existingPass = await Pass.findOne({
      visitorId: visitor._id,
      status: { $in: ["pending", "approved"] }
    });

    if (existingPass) {
      return res.status(400).json({
        success:false,
        error: "Active pass already exists for this visitor",
      });
    }

    const qrData = `VISITOR:${visitor._id}`;
    const qrCode = await QRCode.toDataURL(qrData);

    const pass = await Pass.create({
      visitorId: visitor._id,
      hostId: visitor.hostId || null,
      issuedBy: req.user.id,
      qrCode,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        passId: pass._id,
        isPassIssued: true
      });
    }
    const data = await Pass.findOne({ _id: pass._id }).populate("visitorId");
    await sendPassEmail(visitor.name, visitor.email, qrCode);
    res.status(200).json({
      success:true,
      data:data
    });

  } catch (error) {
    res.status(500).json({
      success:false,
      error: error.message,
    });
  }
};

exports.getPassesByHost = async (req, res) => {
  try {
    const hostId = req.user.id;

    const passes = await Pass.find({ hostId })
      .populate("visitorId", "name email phone photo")
      .populate("hostId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: passes.length,
      data: passes
    });

  } catch (error) {
    res.status(500).json({ success:false, error: error.message });
  }
};

exports.getAllActivePasses = async (req, res) => {
  try {
    const now = new Date();

    const passes = await Pass.find({
      validFrom: { $lte: now },
      validTo: { $gte: now }
    })
      .populate("visitorId", "name email phone photo")
      .populate("hostId", "name email")
      .sort({ validFrom: -1 });

    res.status(200).json({
      success: true,
      count: passes.length,
      data: passes
    });

  } catch (error) {
    res.status(500).json({success:false, error: error.message });
  }
};

exports.createPassForWalkinVisitor = async (req, res) => {
  try {
    //console.log("walk in pass")
    const { name, email, phone, hostEmail, purpose } = req.body;

    const host = await User.findOne({ email: hostEmail });
    console.log(host);
    if (!host) {
      return res.status(404).json({success:false, error: "Host not found" });
    }
    const photo = req.file ? req.file.filename : null;
    let visitor = await Visitor.findOne({ email });

    if (!visitor) {
      const { isValid, errors } = validateVisitor({name, email, phone});
    if (!isValid) {
      return res.status(400).json({ success:false, error:errors });
    }
      visitor = await Visitor.create({
        name,
        email,
        phone,
        photo,
        hostId: host._id
      });
    }
    const appointment = await Appointment.create({
      visitorId: visitor._id,
      hostId: host._id,
      purpose,
      visitDate: new Date(),
      status: "approved",
      date: new Date(),
    });

    const qrData = `VISITOR:${visitor._id}`;
    const qrCode = await QRCode.toDataURL(qrData);
    const pass = await Pass.create({
      visitorId: visitor._id,
      hostId: host._id,
      validFrom: new Date(),
      validTo: new Date(new Date().setHours(new Date().getHours() + 2)),
      issuedBy: req.user.id,
      qrCode,
    });

    if (appointment) {
      await Appointment.findByIdAndUpdate(appointment._id, {
        passId: pass._id,
        isPassIssued: true
      });
    }
    console.log("pass created")

    const data = await Pass.findOne({ _id: pass._id }).populate("visitorId");
    await sendPassEmail(visitor.name, visitor.email, qrCode);
    res.status(200).json({
      success:true,
      message: "Walk-in pass created",
      data,
    });

  } catch (error) {
    res.status(500).json({success:false, error: error.message });
  }
};

exports.scanQR = async (req, res) => {
  try {
    const { qrData } = req.body;

    const visitorId = qrData.split(":")[1];

    const pass = await Pass.findOne({ visitorId });

    if (!pass) {
      return res.status(404).json({success:false, error: "Pass not found" });
    }

    const now = new Date();
    if (now > pass.validTo) {
      return res.status(400).json({ success:false,error: "Pass expired" });
    }

    if (!pass.checkInTime) {
      pass.checkInTime = now;
      pass.visitStatus = "checked-in";
      await pass.save();

      await Log.create({
        passId: pass._id,
        visitorId: pass.visitorId,
        checkInTime: now
      });

      return res.status(200).json({
        success:true,
        message: "Checked IN" 
      });
    }

    if (!pass.checkOutTime) {
      pass.checkOutTime = now;
      pass.visitStatus = "checked-out";
      await pass.save();

      const log = await Log.findOne({
        passId: pass._id,
        visitorId: pass.visitorId
      });

      if (!log) {
        return res.status(404).json({success:false, error: "Log not found for checkin" });
      }

      log.checkOutTime = now;
      await log.save();

      return res.json({success:true, error: "Checked OUT" });
    }

    return res.status(400).json({
      success:false,
      error: "Visit already completed"
    });

  } catch (error) {
    res.status(500).json({success:false, error: error.message });
  }
};

exports.generatePass = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Pass.findById(id).populate("visitorId");
    if (!data) {
      return res.status(404).json({ success:false,error: "Pass not found" });
    }

    const doc = new PDFDocument();
    res.setHeader(`Content-Type", "application/pdf`);
    res.setHeader("Content-Disposition", `attachment; filename=pass-${data.visitorId.name}.pdf`);
    doc.pipe(res);

    doc.fontSize(14).text("Visitor Pass", 0, 10, { align: "center" });
    doc.moveDown();
    doc.image(data.visitorId.photo, 20, 50, { width: 60, height: 60, });
    doc.fontSize(10);
    doc.text(`Name: ${data.visitorId.name}`, 100, 50);
    doc.text(`Email: ${data.visitorId.email}`, 100, 70);

    doc.text(`Valid From: ${new Date(data.validFrom).toLocaleDateString()}`, 100, 90);
    doc.text(`Valid To: ${new Date(data.validTo).toLocaleDateString()}`, 100, 90);
    doc.image(data.qrCode, 250, 50, { width: 70, height: 70, });
    doc.end()
  } catch (error) {
    res.status(500).json({success:false, error: error.message });
  }
}