class APIFeatures {
  private query: any;
  private queryParams: any;

  constructor(query: any, queryParams: any) {
    this.query = query;
    this.queryParams = queryParams;
  }

  filter(): this {
    const queryObj = { ...this.queryParams };
    const excludedFields = ["search", "sort", "lastId", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  search(searchField: string): this {
    if (this.queryParams.search) {
      const searchRegex = new RegExp(this.queryParams.search, "i"); // Case-insensitive
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

  // 🔹 Pagination (Cursor-based)
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
    return this.query;
  }
}

export default APIFeatures;
