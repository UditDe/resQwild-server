const BigPromise = require("../middlewares/bigPromise");
const Report = require("../models/report.model");
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
	const product = await Report.create(req.body);

	res.status(201).json({
		success: true,
		message: "Report added successfully",
		product,
	});
});
