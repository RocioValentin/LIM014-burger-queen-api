const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const User = require('../models/user');

const { secret } = config;

module.exports = {
  validateUser: (req, resp, next) => {
    const { email, password } = req.body;
    // resp.json({ text: 'Hola mundo' });
    if (!email || !password) {
      return next(400);
    }
    console.info('estoy en el post');
    // TODO: autenticar a la usuarix
    const user = User.findOne({ email });
    user.then((doc) => {
      if (!doc) {
        console.info('Holii no exites');
        return resp.status(400).json({ msg: 'usuario no exite' });
      }
      // Load hash from your password DB.
      console.info(
        'contraseña sin cifrar',
        password,
        'contraseña con cifrado',
        doc.password,
      );
      bcrypt.compare(password, doc.password, (err, result) => {
        console.info('Holii tokenn', result);
        if (err) console.info(err);
        else if (!result) resp.status(400).json({ msg: 'contraseña incorrecta' });
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

        // result == true
      });
    });
    // generar token
    // const token = jwt.sign({ id: user._id }, secret);
    // return resp.json({ token });
  },
};
