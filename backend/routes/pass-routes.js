const express = require("express");
const { issuePass, getAllActivePasses, getPassesByHost, createPassForWalkinVisitor } = require("../controllers/pass-controller");
const {protect} =require("../middleware/auth-middleware.js");
const {authorize} =require("../middleware/role-middleware.js");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/walkin", protect, authorize("security"), upload.single("photo"), createPassForWalkinVisitor);
router.get("/", protect, authorize("employee"), getPassesByHost);
router.post("/:appointmentId", protect, authorize("security"), issuePass);
router.get("/all", protect, authorize("security", "admin"), getAllActivePasses);
module.exports = router;