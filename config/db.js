const mongoose = require("mongoose");

const connectWithDb = () => {
	mongoose
		.set("strictQuery", true)
		.connect(`${process.env.DB_URL}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(console.log("DB Connected!!"))
		.catch((err) => {
			console.log(`DB Connection issues => \n ${err}`);
			process.exit(1);
		});
};

module.exports = connectWithDb;
