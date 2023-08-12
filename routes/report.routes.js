const express = require("express");
const router = express.Router();
const { isLoggedIn, customeRole } = require("../middlewares/user.middleware");
const {
	getAllreport,
	addReport,
} = require("../controllers/reports.controller");

// user routes
router.route("/crime-reports/getall").get(getAllreport);
router.route("/crime-reports/add").post(addReport);

module.exports = router;
