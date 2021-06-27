const bcrypt = require('bcrypt');
const User = require('../models/user');
const { isAdmin } = require('../middleware/auth');
const {
  Paginate,
  emailOrId,
  isAValidEmail,
  isAWeakPassword,
} = require('../utils/utils');

// contraseña valido /?=.*[0-9]/
// contraseña invalido ^$
// email invalido /?=.*[0-9]/
// email valido ^[^@]+@[^@]+\.[a-zA-Z]{2,}$

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
      resp.links(Paginate(url, options, userPaginate));
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

      if (password && isAWeakPassword(password)) return next(400);

      if (email && !isAValidEmail(email)) return next(400);

      const newUser = new User({
        email,
        password,
        roles,
      });

      const user = await newUser.save(newUser);
      return resp.status(200).send({
        _id: user._id,
        email: user.email,
        // password: user.password,
        roles: user.roles,
      });
    } catch (err) {
      next(err);
    }
  },
  updateUser: async (req, res, next) => {
    const user = req.body;
    try {
      const { uid } = req.params;
      const getEmailOrId = emailOrId(uid);
      const findUser = await User.findOne(getEmailOrId);
      // si la usuaria solicitada no existe
      if (!findUser) return next(404);
      // una usuaria no admin intenta de modificar sus `roles`
      if (!isAdmin(req) && user.roles) return next(403);

      // si no es ni admin o la misma usuaria
      if (req.userAuth.uid !== findUser._id.toString() && !isAdmin(req)) {
        return next(403);
      }
      // si no se proveen `email` o `password` o ninguno de los dos
      if (Object.keys(user).length === 0) return next(400);

      const userUpdate = await User.findOneAndUpdate(
        getEmailOrId,
        {
          $set: user,
        },
        { new: true },
      ).select('-password');

      // console.log(req.userAuth, findUser);

      return res.status(200).json(userUpdate);
    } catch (err) {
      next(err);
      // should fail with 404 when admin not found
      // cambio de err a 404
    }
  },

  deleteUser: async (req, resp, next) => {
    try {
      // const userId = req.params.uid;
      // const findUser = await User.findOne({ _id: userId });
      const { uid } = req.params;
      const getEmailOrId = emailOrId(uid);

      const findUser = await User.findOne(getEmailOrId);
      if (!findUser) return next(404);
      if (req.userAuth.uid !== findUser._id.toString() && !isAdmin(req)) {
        return next(403);
      }
      // console.log('ad!!!', !req.userAuth.uid, '  z ', req.params.uid);
      // console.log('??????admin', !isAdmin(req));
      await User.findOneAndDelete(getEmailOrId);

      return resp.status(200).send(findUser);
    } catch (err) {
      next(404);
    }
  },
};
