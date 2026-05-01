
exports.buildPagination = (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;

  const sort = query.sort || 'createdAt';   // default sort
  const order = query.order === "asc" ? "ASC" : "DESC"; // default DESC

  return {
    page,
    limit,
    offset: (page - 1) * limit,
    where: {},
    order: [[sort, order]],
  };
};
