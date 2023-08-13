const mongoose = require("mongoose");
const crypto = require("crypto");

const reportSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "please provide a report title"],
		trim: true,
		maxlength: [120, "report title must be at most 120 characters"],
	},

	description: {
		type: String,
		required: [true, "please provide a report description"],
	},

	location: {
		type: String,
		required: [true, "please provide the location"],
	},

	assignedperson: {
		type: Object,
	},

	reportId: {
		type: String,
	},
});

reportSchema.pre("save", async function (next) {
	const id = await crypto.randomBytes(20).toString("hex");
	if (!this.isModified("reportId")) {
		return next();
	}
	this.reportId = id;
});

module.exports = mongoose.model("Report", reportSchema);
