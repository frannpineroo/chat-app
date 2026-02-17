const usuarioServicio = require('../services/usuario.servicio');

const login = async ( req, res ) => {
    try{
        const { email, contra } = req.body;

        const { token, usuario } = await usuarioServicio.loginUsuario( email, contra );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 1 hora
        });

        res.json({
            mensaje: 'Login exitoso',
            usuario
        });
    } catch ( err ) {
        res.status(400).json({ error: err.message });
    }
};

const logout = ( req, res ) => {
    
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });

    res.json({ mensaje: 'Logout exitoso' });
};

module.exports = {
    login,
    logout
}