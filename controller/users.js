const bcrypt = require('bcrypt');
const User = require('../models/user');
// Aquí debe ir la lógica de crear al usuario y
// dar acceso a la bs
module.exports = {
  getUsers: async (req, resp, next) => {

  },
  createUsers: async (req, resp, next) => {
    const { email, password, roles } = req.body;
    try {
      if (!email || !password || password <= 5) return next(400);

      const findUser = await User.findOne({ email });
      if (findUser) {
        return next(403);
      }

      const saltRounds = 10;
      const newUser = new User({
        email,
        password: bcrypt.hashSync(password, saltRounds),
        roles: roles.admin,
      });

      const user = await newUser.save(newUser);
      resp.status(200).json({
        id: user.id,
        email: user.email,
        password: user.password,
        roles: user.roles,
      });
    } catch (err) {
      next(err);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      console.log('estoy en try');
      const userId = req.params.uid;
      const findUser = await User.findOne({ _id: userId });
      console.log(findUser);
      await User.findByIdAndDelete({ _id: userId });
      res.status(200).json(findUser);
    } catch (err) {
      next(err);
    }
  },
};
