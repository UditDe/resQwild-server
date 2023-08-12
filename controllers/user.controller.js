const User = require("../models/user.model");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customeError");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
// const mailHelper = require("../utils/emailHelper");
const crypto = require("crypto");

// for all users
exports.signup = BigPromise(async (req, res, next) => {
	// if (!req.files) {
	// 	return next(new CustomError("Photo is required for sign up", 400));
	// }
	const { name, email, password } = req.body;
	// console.log(req.body);
	if (!email || !password || !name) {
		return next(new CustomError("email, password are required", 400));
	}

	// let file = req.files.photo;
	// const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
	// 	folder: "users",
	// 	width: 150,
	// 	crop: "scale",
	// });

	//createing the user
	const user = await User.create({
		name,
		email,
		password,
	});

	cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
	const { email, password } = req.body;

	//check for presence of email & password
	if (!email || !password) {
		return next(new CustomError("please provide email and password", 400));
	}

	// get user from db
	const user = await User.findOne({ email }).select("+password");

	// if user not found in db
	if (!user) {
		return next(new CustomError("Email or Password is incorrect", 400));
	}

	// match the password
	const isCorrectPassword = await user.isValidatedPassword(password);

	// if the password is wrong
	if (!isCorrectPassword) {
		return next(new CustomError("Wrong Password", 400));
	}

	// if all goes good the send the token
	cookieToken(user, res);
});

exports.getUserData = BigPromise(async (req, res, next) => {
	// getting the user from Db
	// the user.id is injected by the middleware which we have used in the routes
	const user = await User.findById(req.user.id);
	// sending a json response
	res.status(200).json({
		success: true,
		user,
	});
});

exports.addresqers = BigPromise(async (req, res, next) => {
	const { name, email, password, phoneNumber, role } = req.body;
	// if (!email || !password || !name || !phoneNumber || !role) {
	// 	return next(new CustomError("All fields are required", 400));
	// }
	const user = await User.findById(req.user.id);
	//createing the user
	// const resQer = await User.create({
	// 	name,
	// 	email,
	// 	password,
	// 	role,
	// 	orgName : user
	// });

	// res.status(200).json({
	// 	success: true,
	// 	message: "ResQer created",
	// 	user : resQer,
	// });

	res.json({
		user,
	});
});

exports.orgRegistration = BigPromise(async (req, res, next) => {
	const { orgName, orgLocation, phoneNumber, email, password } = req.body;
	console.log(req.body);
	if (!email || !password || !orgName || !orgLocation || !phoneNumber) {
		return next(new CustomError("All fields are required", 400));
	}

	const user = await User.create({
		orgName,
		orgLocation,
		phoneNumber,
		email,
		password,
		role: "org",
	});

	cookieToken(user, res);
});
