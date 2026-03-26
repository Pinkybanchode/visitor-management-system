const express = require("express");
const { protect } = require("../middleware/auth-middleware.js");
const { authorize } = require("../middleware/role-middleware.js");
const { getStatics,getReport, getJson } = require("../controllers/dashboard-controller.js");
const router = express.Router();

//router.get("/", protect, authorize("admin"), getDashboard);
router.get("/stats", protect, authorize("admin"), getStatics)
router.get("/reports", protect, authorize("admin"), getReport)
router.get("/admin/export", protect, authorize("admin"), getJson)
module.exports = router;