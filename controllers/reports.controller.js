const BigPromise = require("../middlewares/bigPromise");
const Report = require("../models/report.model");
const User = require("../models/user.model");
const CustomError = require("../utils/customeError");
const cloudinary = require("cloudinary");
const WhereClause = require("../utils/whereClause");

exports.getAllreport = BigPromise(async (req, res, next) => {
	const resultPerPage = 6;
	const totalcountCrime = await Report.countDocuments();

	const crimesObj = new WhereClause(Report.find(), req.query).search().filter();

	let crimes = await crimesObj.base;
	const filteredCrimeNumber = crimes.length;

	crimesObj.pager(resultPerPage);
	crimes = await crimesObj.base.clone();
	res.status(200).json({
		success: true,
		crimes,
		filteredCrimeNumber,
		totalcountCrime,
	});
});

exports.addReport = BigPromise(async (req, res, next) => {
	const reports = await Report.create(req.body);

	res.status(201).json({
		success: true,
		message: "Report added successfully",
		reports,
	});
});

exports.assignReport = BigPromise(async (req, res, next) => {
	const { name, reportDetails } = req.body;
	const existingUser = await User.findOne({ name });
	const updatedCrime = await Report.findByIdAndUpdate(
		reportDetails._id,
		{ ...reportDetails, assignedperson: existingUser },
		{
			new: true, // Return the updated document
			runValidators: true,
			useFindAndModify: false,
		}
	);

	res.status(200).json({
		success: true,
		updatedCrime,
	});
});
