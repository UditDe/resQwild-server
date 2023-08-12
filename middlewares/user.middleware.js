const User = require("../models/user.model");
const BigPromise = require("./bigPromise");
const CustomeError = require("../utils/customeError");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
	const token =
		req.cookies.token || req.header("Authorizarion").replace("Bearer ", "");

	if (!token) {
		return next(new CustomeError("Login first to access this page", 401));
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	req.user = await User.findById(decoded.id);
	next();
});

exports.customeRole = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new CustomeError("You are not allowed for this resource", 403)
			);
		}
		next();
	};
};
