const User = require('../models/user');
// Aquí debe ir la lógica de crear al usuario y
// dar acceso a la bs
module.exports = {
  getUsers: (req, resp, next) => {
  },
  createUsers: (req, resp, next) => {
    const { email, password, role } = req.body;

    const newAdminUser = new User({
      email,
      password,
      role,
    });
    newAdminUser.save();
    next();
    return resp.json({ msg: 'usuario añadido' });
  },
};
