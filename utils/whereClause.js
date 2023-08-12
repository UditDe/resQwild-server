// base - productModel.find()

// biqQuerry - /search=coder&page=2&category=shortsleeves&rating[gte]=4
// &price[lte]=999&price[gte]=199

class WhereClause {
	constructor(base, bigQuerry) {
		this.base = base;
		this.bigQuerry = bigQuerry;
	}

	search() {
		const searchWord = this.bigQuerry.search
			? {
					name: {
						$regex: this.bigQuerry.search,
						$option: "i", //this is for case - insensitivity
					},
			  }
			: {};

		this.base = this.base.find({ ...searchWord });
		return this;
	}

	filter() {
		const copyQuerry = { ...this.bigQuerry };

		delete copyQuerry["search"];
		delete copyQuerry["page"];
		delete copyQuerry["limit"];

		//convert bigQ into a string => copyQ
		let stringOfCopyQuerry = JSON.stringify(copyQuerry);

		stringOfCopyQuerry = stringOfCopyQuerry.replace(
			/\b(gte|lte|gt|lt)/g,
			(m) => `$${m}`
		);

		const jsonOfCopyQ = JSON.parse(stringOfCopyQuerry);

		this.base = this.base.find(jsonOfCopyQ);

		return this;
	}

	pager(resultperPage) {
		let currentPage = 1;
		if (this.bigQuerry.page) {
			currentPage = this.bigQuerry.page;
		}

		const skipVal = resultperPage * (currentPage - 1);

		this.base = this.base.limit(resultperPage).skip(skipVal);
		return this;
	}
}

module.exports = WhereClause;
