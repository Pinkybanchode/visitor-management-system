const express = require("express");
const { createAppointment, updateAppointmentStatus, getApprovedAppointments, getMyAppointments } = require("../controllers/appointment-controller.js");
const {protect} =require("../middleware/auth-middleware.js");
const {authorize} =require("../middleware/role-middleware.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/",upload.single("photo"), createAppointment);
router.get(
  "/my",
  protect,
  authorize("employee"),
  getMyAppointments
);
router.put("/:id/status", protect, authorize("employee"), updateAppointmentStatus);
router.get("/", protect,  authorize("admin", "security"), getApprovedAppointments);

module.exports = router;