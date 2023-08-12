const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

//morgan middleware
app.use(morgan("tiny"));

//regular middleware
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

//cookie and file middleware
app.use(cookieParser());
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

//import all routes here
const user = require("./routes/user.routes");
const report = require("./routes/report.routes");

//router middleware
app.use("/api", user);
app.use("/api", report);

app.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		message: `running on ${process.env.PORT}`,
	});
});

// export app js
module.exports = app;
