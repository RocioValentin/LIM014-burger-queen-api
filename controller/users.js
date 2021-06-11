const User = require('../models/user');

// Aquí debe ir la lógica de crear al usuario y
// dar acceso a la bs
module.exports = {
  getUsers: (req, resp, next) => {
  },
  createUsers: (req, resp, next) => {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      roles: req.body.roles.admin,
    });

    user.save((err, usr) => {
      err && resp.status(500).send(err.message);

      resp.status(200).json(usr);
    });
    next();

    // const user = new User({
    //   email: req.body.email,
    //   password: req.body.password,
    //   roles: req.body.roles.admin,
    // });
    // console.log(user);
    // const saveUser = User.save(user);
    // saveUser.then((usr) => {
    //   if (usr) {
    //     resp.status(200).json(usr);
    //   }

    // })
    //   .catch((err) => next(err));

    // try {
    //   console.log('entro al try');
    //   const newUser = new User(req.body);
    //   const user = await newUser.save(newUser);
    //   resp.status(200).json({
    //     _id: user._id,
    //     email: user.email,
    //     password: user.password,
    //     roles: user.roles,
    //   });
    // } catch (err) {
    //   console.log('entro al catch');
    //   next(err);
    // }
  },
};
