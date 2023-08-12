const User = require("../models/user.model");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customeError");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const mailHelper = require("../utils/emailHelper");
const crypto = require("crypto");

// for all users
exports.signup = BigPromise(async (req, res, next) => {
	if (!req.files) {
		return next(new CustomError("Photo is required for sign up", 400));
	}
	const { name, email, password } = req.body;

	if (!email || !name || !password) {
		return next(new CustomError("name, email, password are required", 400));
	}

	let file = req.files.photo;
	const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
		folder: "users",
		width: 150,
		crop: "scale",
	});

	//createing the user
	const user = await User.create({
		name,
		email,
		password,
		photo: {
			id: result.public_id,
			secure_url: result.secure_url,
		},
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

exports.logout = BigPromise(async (req, res, next) => {
	res.cookie("token", null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		message: "Logout success",
	});
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
	const { email } = req.body;
	// finding the user in the database
	const user = await User.findOne({ email });
	// if the user is not present
	if (!user) {
		return next(new CustomError("Email not found as registered", 400));
	}
	// if the user is present then create token
	const forgotToken = user.getForgotPasswordToken();
	// save the token
	await user.save({ validateBeforeSave: false });
	// creating the url that will be send to user
	const myUrl = `${req.protocol}://${req.get(
		"host"
	)}/password/reset/${forgotToken}`;
	// custome msg that will be send to user in the email
	const message = `Copy paste this link in your URL and Hit enter \n\n ${myUrl}`;
	// using mailhelper utility function
	try {
		await mailHelper({
			email: user.email,
			subject: "LCO TStore - Password reset email",
			message,
		});

		res.status(200).json({
			success: true,
			message: "Email sent successfully",
		});
	} catch (err) {
		// if something goes wrong then flused out the token from the Db
		user.forgotPasswordToken = undefined;
		user.forgotPasswordExpiry = undefined;
		user.save({ validateBeforeSave: false });

		return next(new CustomError(err.message, 500));
	}
});

exports.passwordReset = BigPromise(async (req, res, next) => {
	const token = req.params.token;

	const encryptedToken = crypto
		.createHash("sha256")
		.update(token)
		.digest("hex");

	const user = await User.findOne({
		encryptedToken,
		forgotPasswordExpiry: { $gt: Date.now() },
	});

	if (!user) {
		return next(new CustomError("Token is invalid or expired", 400));
	}

	if (req.body.password !== req.body.confirmPassword) {
		return next(new CustomError("password and confirmpassword doesn't match"));
	}

	user.password = req.body.password;
	user.forgotPasswordToken = undefined;
	user.forgotPasswordExpiry = undefined;

	await user.save();

	// send a json resp Or send Token
	cookieToken(user, res);
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
	// getting the user from Db
	// the user.id is injected by the middleware which we have used in the routes
	const user = await User.findById(req.user.id);
	// sending a json response
	res.status(200).json({
		success: true,
		user,
	});
});

exports.changePassword = BigPromise(async (req, res, next) => {
	const userId = req.user.id;

	const user = await User.findById(userId).select("+password");

	const isCorrectOldPassword = await user.isValidatedPassword(
		req.body.oldPassword
	);

	if (!isCorrectOldPassword) {
		return next(new CustomError("old password is incorrect", 400));
	}

	user.password = req.body.password;
	await user.save();

	cookieToken(user, res);
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {
	const newData = {
		name: req.body.name,
		email: req.body.email,
	};

	if (req.files) {
		// finding the user from Db
		const user = await User.findById(req.user.id);
		// getting the image Id
		const imageId = user.photo.id;
		//delete photo on cloudinary
		const resp = await cloudinary.v2.uploader.destroy(imageId);
		// upload the new photo
		const result = await cloudinary.v2.uploader.upload(
			req.files.photo.tempFilePath,
			{
				folder: "users",
				width: 150,
				crop: "scale",
			}
		);
		newData.photo = {
			id: result.public_id,
			secure_url: result.secure_url,
		};
	}

	const user = await User.findByIdAndUpdate(req.user.id, newData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({
		success: true,
		user,
	});
});

// admin only route
exports.adminAllUsers = BigPromise(async (req, res, next) => {
	const users = await User.find();

	res.status(200).json({
		success: true,
		users,
	});
});

exports.adminGetSingleUser = BigPromise(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		next(new CustomError("No user found", 400));
	}

	res.status(200).json({
		success: true,
		user,
	});
});

exports.adminUpdateSingleUser = BigPromise(async (req, res, next) => {
	const newData = {
		name: req.body.name,
		email: req.body.email,
		role: req.body.role,
	};

	// if (req.files) {
	// 	// finding the user from Db
	// 	const user = await User.findById(req.user.id);
	// 	// getting the image Id
	// 	const imageId = user.photo.id;
	// 	//delete photo on cloudinary
	// 	const resp = await cloudinary.v2.uploader.destroy(imageId);
	// 	// upload the new photo
	// 	const result = await cloudinary.v2.uploader.upload(
	// 		req.files.photo.tempFilePath,
	// 		{
	// 			folder: "users",
	// 			width: 150,
	// 			crop: "scale",
	// 		}
	// 	);
	// 	newData.photo = {
	// 		id: result.public_id,
	// 		secure_url: result.secure_url,
	// 	};
	// }

	const user = await User.findByIdAndUpdate(req.params.id, newData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({
		success: true,
		user,
	});
});

exports.adminDeleteSingleUser = BigPromise(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new CustomError("No user found", 401));
	}

	const imageId = user.photo.id;
	await cloudinary.v2.uploader.destroy(imageId);

	await user.remove();
	res.status(200).json({
		success: true,
		message: "User deleted successfully",
	});
});

// manager only route
exports.managerAllUser = BigPromise(async (req, res, next) => {
	const user = await User.find({ role: "user" });
	res.status(200).json({
		success: true,
		user,
	});
});
