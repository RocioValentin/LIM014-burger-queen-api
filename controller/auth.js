const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const User = require('../models/user');
const { isAWeakPassword } = require('../utils/utils');

const { secret } = config;

module.exports = {
  validateUser: (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }
    // console.log('body', req.body);
    // TODO: autenticar a la usuarix
    const user = User.findOne({ email });
    user.then((doc) => {
      if (!doc) {
        return resp.status(400).json({ msg: 'usuario no exite' });
      }
      // console.log('database', doc);
      // if (doc.email !== email && doc.password !== password) { return next(404); }
      bcrypt.compare(password, doc.password, (err, result) => {
        if (err) console.info(err);
        else if (!result) return resp.status(404).json({ msg: 'contraseña incorrecta' });
        jwt.sign(
          {
            uid: doc.id,
            email: doc.email,
            roles: doc.roles,
          },
          secret,
          { expiresIn: 60 * 60 },
          (err, token) => {
            if (err) {
              console.error(err);
            }
            return resp.status(200).json({ token });
          },
        );
      });
    });
  },
};
