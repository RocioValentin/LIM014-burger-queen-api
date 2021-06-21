const bcrypt = require('bcrypt');
const User = require('../models/user');
const { isAdmin } = require('../middleware/auth');

const emailOrId = (params) => {
  const checkForValidMongoDbID = new RegExp('^[0-9a-fA-F]{24}$');
  const validObjectId = checkForValidMongoDbID.test(params);

  if (validObjectId) {
    return { _id: params };
  }
  return { email: params };
};

// Aquí debe ir la lógica de crear al usuario y
// dar acceso a la bs
module.exports = {
  getUsers: async (req, resp, next) => {
    try {
      const url = `${req.protocol}://${req.get('host')}${req.path}`;
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };
      const userPaginate = await User.paginate({}, options);
      resp.links({
        first: `${url}?limit=${options.limit}&page=${1}`,
        prev: `${url}?limit=${options.limit}&page=${options.page - 1}`,
        next: `${url}?limit=${options.limit}&page=${options.page + 1}`,
        last: `${url}?limit=${options.limit}&page=${userPaginate.totalPages}`,
      });
      return resp.status(200).json(userPaginate.docs);
    } catch (err) { next(err); }
  },
  getUserId: async (req, resp, next) => {
    try {
      const { uid } = req.params;
      const getEmailOrId = emailOrId(uid);
      const findUser = await User.findOne(getEmailOrId).lean();
      if (!findUser) {
        return next(404);
      }
      if (req.userAuth.uid === findUser._id.toString() || isAdmin(req)) return resp.json(findUser);
      // console.log(req.userAuth, findUser);
      return next(403);
    } catch (err) {
      return next(err);
    }
  },
  createUsers: async (req, resp, next) => {
    const { email, password } = req.body;
    let roles;
    if (req.body.roles) {
      roles = req.body.roles;
    } else {
      roles = { admin: false };
    }
    try {
      if (!email || !password || password <= 5) return next(400);

      const findUser = await User.findOne({ email });
      if (findUser) {
        return next(403);
      }

      const newUser = new User({
        email,
        password,
        roles: roles.admin || false,
      });

      const user = await newUser.save(newUser);
      resp.status(200).send({
        id: user.id,
        email: user.email,
        // password: user.password,
        roles: user.roles,
      });
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req, res, next) => {
    const { email, password, roles } = req.body;
    try {
      const userId = req.params.uid;
      const saltRounds = 10;

      await User.findByIdAndUpdate({ _id: userId }, {
        email,
        password: bcrypt.hashSync(password, saltRounds),
        roles,
      });

      const findUser = await User.findOne({ _id: userId });
      res.status(200).send(findUser);
    } catch (err) {
      next(err);
    }
  },

  deleteUser: async (req, resp, next) => {
    try {
      const userId = req.params.uid;
      const findUser = await User.findOne({ _id: userId });
      await User.findByIdAndDelete({ _id: userId });
      resp.status(200).send(findUser);
    } catch (err) {
      next(err);
    }
  },
};
