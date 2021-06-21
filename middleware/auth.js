// esto es lo primero
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;
  // Si no exite next() 401
  if (!authorization) {
    // return resp.status(401).send({message: 'No tiene autenticación'});
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  // Verificar la validez del token
  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }

    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    const userFindById = User.findById(decodedToken.uid);
    userFindById
      .then((doc) => {
        if (!doc) {
          return next(404);
        }
        req.userAuth = decodedToken;
        // console.log(decodedToken);
        return next();
      })
      .catch(() => next(403));
  });
};

// TODO: decidir por la informacion del request si la usuaria esta autenticada
module.exports.isAuthenticated = (req) => {
  // Comprobar si en el objeto req existe un campo authorization
  if (req.userAuth) {
    return true;
  }
  return false;
};

// TODO: decidir por la informacion del request si la usuaria es admin
module.exports.isAdmin = (req) => (req.userAuth.roles.admin || false);

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

