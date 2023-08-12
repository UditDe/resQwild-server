class CustomError extends Error {
	constructor(messgae, code) {
		super(messgae);
		this.code = code;
	}
}

module.exports = CustomError;
