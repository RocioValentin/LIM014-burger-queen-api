module.exports = {
  Paginate: (url, options, userPaginate) => {
    const objectPaginate = {
      first: `${url}?limit=${options.limit}&page=${1}`,
      prev: `${url}?limit=${options.limit}&page=${options.page - 1}`,
      next: `${url}?limit=${options.limit}&page=${options.page + 1}`,
      last: `${url}?limit=${options.limit}&page=${userPaginate.totalPages}`,
    };
    return objectPaginate;
  },
  emailOrId: (params) => {
    const checkForValidMongoDbID = new RegExp('^[0-9a-fA-F]{24}$');
    const validObjectId = checkForValidMongoDbID.test(params);

    if (validObjectId) {
      return { _id: params };
    }
    return { email: params };
  },
  isObjectId: (params) => {
    const checkForValidMongoDbID = new RegExp('^[0-9a-fA-F]{24}$');
    return checkForValidMongoDbID.test(params);
  },
  isAValidEmail: (email) => {
    const emailRegex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/i;
    return (emailRegex.test(email));
  },
  isAWeakPassword: (password) => ((password.length <= 3)),
};
