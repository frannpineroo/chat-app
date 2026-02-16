const usuarioServicio = require('../services/usuario.servicio');

const registrarUsuario = async ( req, res ) => {
    try {
        const { nombre, apellido, email, contra } = req.body;

        const nuevoUsuario = await usuarioServicio.registrarUsuario({
            nombre,
            apellido,
            email,
            contra
        });

        res.status(201).json(nuevoUsuario);
    } catch ( error ) {
        console.error(error.message);

        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    registrarUsuario
}