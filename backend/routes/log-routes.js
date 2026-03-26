const express = require("express");
const {getLogs} = require("../controllers/log-controller.js");
const {protect} =require("../middleware/auth-middleware.js");
const {authorize} =require("../middleware/role-middleware.js");

const router = express.Router();

router.get("/", protect, authorize("admin", "security"), getLogs);

module.exports = router;