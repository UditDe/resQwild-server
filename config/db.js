require("dotenv").config();
const mongoose = require("mongoose");

const connectWithDb = () => {
	mongoose
		.set("strictQuery", true)
		.connect(
			"mongodb+srv://udit:ygvskY1JNKa0YsLS@resqwild.egpdsfl.mongodb.net/",
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		)
		.then(console.log("DB Connected!!"))
		.catch((err) => {
			console.log(process.env.DB_URL);
			console.log(`DB Connection issues => \n ${err}`);
			process.exit(1);
		});
};

module.exports = connectWithDb;
