const jwt = require('jsonwebtoken');

const redirigirSiAutenticado = ( req, res, next ) => {

    const token = req.cookies.token;

    if ( !token ) {
        return next();
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return res.redirect('/perfil');
    } catch ( err ) {
        return next();
    }
};

module.exports = redirigirSiAutenticado;