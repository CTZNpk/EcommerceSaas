class APIFeatures {
  private query: any;
  private queryParams: any;

  constructor(query: any, queryParams: any) {
    this.query = query;
    this.queryParams = queryParams;
  }

  filter(): this {
    const queryObj = { ...this.queryParams };
    const excludedFields = [
      "search",
      "sort",
      "lastId",
      "limit",
      "accountType",
      "username",
    ];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  search(searchField: string): this {
    const searchValue = this.queryParams[searchField];
    if (!searchValue || searchValue.trim() === "") {
      return this;
    }
    if (this.queryParams[searchField]) {
      const searchRegex = new RegExp(`^${searchValue}`, "i"); // Case-insensitive
      this.query = this.query.find({ [searchField]: searchRegex });
    }
    return this;
  }

  sort(): this {
    if (this.queryParams.sort) {
      const sortBy = this.queryParams.sort.split(",").join(" "); // Convert 'field1,field2' -> 'field1 field2'
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate(): this {
    const limit = parseInt(this.queryParams.limit) || 10;
    const lastId = this.queryParams.lastId;

    if (lastId) {
      this.query = this.query.find({ _id: { $gt: lastId } });
    }

    this.query = this.query.limit(limit);
    return this;
  }

  // Get final query
  getQuery(): any {
    console.log(this.queryParams);
    return this.query;
  }
}

export default APIFeatures;
