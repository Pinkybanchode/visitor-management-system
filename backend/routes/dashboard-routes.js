const express = require("express");
const { protect } = require("../middleware/auth-middleware.js");
const { authorize } = require("../middleware/role-middleware.js");
const { getStatics,getLogs, getJson } = require("../controllers/dashboard-controller.js");
const router = express.Router();

router.get("/stats", protect, authorize("admin"), getStatics)
router.get("/logs", protect, authorize("admin", "security"), getLogs)
router.get("/export", protect, authorize("admin", "security"), getJson)
module.exports = router;