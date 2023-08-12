const mongoose = require("mongoose");

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
	// photos: [
	// 	{
	// 		id: {
	// 			type: String,
	// 			required: [true, "please provide a product photo id"],
	// 		},
	// 		secure_url: {
	// 			type: String,
	// 			required: [true, "please provide a product photo secure_url"],
	// 		},
	// 	},
	// ],
	// category: {
	// 	type: String,
	// 	required: [
	// 		true,
	// 		"please provide a product category from => short_sleeves, sweat_shirt, hoodies, long_sleeves",
	// 	],
	// 	enum: {
	// 		values: ["short_sleeves", "sweat_shirt", "hoodies", "long_sleeves"],
	// 		message:
	// 			"Wrong category! product category must be from => short_sleeves, sweat_shirt, hoodies, long_sleeves",
	// 	},
	// },
	// ratings: {
	// 	type: Number,
	// 	default: 0,
	// },
	// numberOfReviews: {
	// 	type: Number,
	// 	default: 0,
	// },
	// reviews: [
	// 	{
	// 		user: {
	// 			type: mongoose.Schema.Types.ObjectId,
	// 			ref: "User",
	// 			required: [true, "please provide the userId"],
	// 		},
	// 		name: {
	// 			type: String,
	// 			required: [true, "please provide a username"],
	// 		},
	// 		rating: {
	// 			type: Number,
	// 			required: [true, "please provide a rating"],
	// 		},
	// 		comment: {
	// 			type: String,
	// 			required: [true, "please provide a comment"],
	// 		},
	// 	},
	// ],
	// user: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: "User",
	// 	required: [true, "please provide the userId"],
	// },
	// createdAt: {
	// 	type: Date,
	// 	default: Date.now,
	// },
});

module.exports = mongoose.model("Report", reportSchema);
