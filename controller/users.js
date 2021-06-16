const bcrypt = require('bcrypt');
const { model } = require('mongoose');
const User = require('../models/user');

// Aquí debe ir la lógica de crear al usuario y
// dar acceso a la bs
module.exports = {
  getUsers: async (req, resp, next) => {
    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    const paginates = await User.paginate({}, options);
    resp.links({
      prev: `http://localhost:8081/users?limit=${options.limit}&page=${options.page - 1}`,
    });

    resp.send(paginates);
    next();
  },
  getUserId: async (req, resp, next) => {
    try {
      const userId = req.params.uid;
      const findUser = await User.findOne({ _id: userId });

      return resp.json(findUser);
    } catch (error) {
      return next(404);
    }
  },
  createUsers: async (req, resp, next) => {
    const { email, password, roles } = req.body;
    try {
      if (!email || !password || password <= 5) return next(400);

      const findUser = await User.findOne({ email });
      if (findUser) {
        return next(403);
      }
      const newUser = new User({
        email,
        password,
        roles: roles.admin,
      });

      const user = await newUser.save(newUser);
      resp.status(200).send({
        id: user.id,
        email: user.email,
        password: user.password,
        roles: user.roles,
      });
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req, res, next) => {
    const { email, password, roles } = req.body;
    try {
      console.log('estoy en try');
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
