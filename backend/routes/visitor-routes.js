const express = require("express");
const { employeeCreateVisitor } = require("../controllers/visitor-controller.js");
const multer = require("multer");
const {protect} =require("../middleware/auth-middleware.js");
const {authorize} =require("../middleware/role-middleware.js");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  protect,
  authorize("employee"),
  upload.single("photo"),
  employeeCreateVisitor
);
module.exports = router;