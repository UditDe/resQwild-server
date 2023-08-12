const express = require("express");
const router = express.Router();
const { isLoggedIn, customeRole } = require("../middlewares/user.middleware");
const {
	signup,
	login,
	getUserData,
	addresqers,
	orgRegistration,
} = require("../controllers/user.controller");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/getUserData").get(isLoggedIn, getUserData);

//org_routes
router.route("/org-registration").post(orgRegistration);
router.route("/org/addResQr").post(isLoggedIn, customeRole("org"), addresqers);

module.exports = router;
