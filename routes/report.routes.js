const express = require("express");
const router = express.Router();
const { isLoggedIn, customeRole } = require("../middlewares/user.middleware");
const {
	getAllreport,
	addReport,
	assignReport,
} = require("../controllers/reports.controller");

// user routes
router.route("/crime-reports/getall").get(getAllreport);
router.route("/crime-reports/add").post(addReport);

// org specific roots
router
	.route("/crime-reports/assign")
	.put(isLoggedIn, customeRole("org"), assignReport);

module.exports = router;
