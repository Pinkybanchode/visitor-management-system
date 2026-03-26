const express = require("express");
const {scanQR} = require("../controllers/pass-controller.js");
const {protect} =require("../middleware/auth-middleware.js");
const {authorize} =require("../middleware/role-middleware.js");

const router = express.Router();

router.post("/", protect, authorize("security"), scanQR)

module.exports = router;