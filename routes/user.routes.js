const express = require("express");
const router = express.Router();
const { isLoggedIn, customeRole } = require("../middlewares/user.middleware");
const { signup, login } = require("../controllers/user.controller");

router.route("/signup").post(signup);
router.route("/login").post(login);

module.exports = router;
