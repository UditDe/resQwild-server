require("dotenv").config();
const app = require("./app");
const connectWithDb = require("./config/db");

// connect with database
connectWithDb();

//connect with cloudinary
const cloudinary = require("cloudinary");
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT, () => {
	console.log(`Server listening on ${process.env.PORT}`);
});
