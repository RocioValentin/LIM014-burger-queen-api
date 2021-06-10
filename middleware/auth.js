// esto es lo primero
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    console.log('entrandooo');
    if (err) {
      return next(403);
    }

    const user = User.findOne({ email: decodedToken.email });

    user.then((doc) => {
      if (!doc) {
        console.log('usuario no encontrado');
        return next(400);
      }
      req.userAuth = decodedToken;
      console.log(req);
      return resp.status(200).json({
        msg: 'usuario autenticado',
      });
    }).catch((err) => console.log(err));

    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    // if (err) { return next(403); } const usersService =
    //  new UsersService(); const { userId } = decodedToken; const user
    // = await usersService.getUser({ userId }); if (user && user.email ===
    // decodedToken.userEmail && user.roles.admin === decodedToken.userRol.admin)
    // { req.userDecoded = decodedToken; return next(); } return next(401); }); 
  });
};

module.exports.isAuthenticated = (req) => {
  if (req.userAuth) {
    return true;
  }
  return false;
};
// TODO: decidir por la informacion del request si la usuaria esta autenticada
// module.exports.isAuthenticated = (req) =>
// { if (req.userDecoded) { return true; } return false; };

module.exports.isAdmin = (req) => {
  if (req.userAuth.role.admin === true) {
    return true;
  }
  return false;
  // TODO: decidir por la informacion del request si la usuaria es admin
};
// es lo que primero se avanza
module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
