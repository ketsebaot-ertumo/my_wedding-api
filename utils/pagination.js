exports.buildPagination = (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;

  const pagination = {
    page,
    limit,
    offset: (page - 1) * limit,
    where: {},
  };

  if (query.sort) {
    const sort = query.sort ? query.sort : 'created_at';
    const order = query.order === "asc" ? "ASC" : "DESC";
    pagination.order = [[sort, order]];
  }

  return pagination;
};
