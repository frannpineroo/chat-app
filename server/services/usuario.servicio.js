const usuarioRepo = require('../repositories/usuario.repositorio');

const registrarUsuario = async ({ nombre, apellido, email, contra } ) => {
    //validar mail
    const existente = await usuarioRepo.obtenerUsuarioPorEmail( email );

    if ( existente ) {
        throw new Error('El usuario ya existe');
    }

    // crear usuario
    const nuevoUsuario = await usuarioRepo.crearUsuario({
        nombre,
        apellido,
        email,
        contra,
        isOnline: true
    });

    return nuevoUsuario;
};

module.exports = {
    registrarUsuario
}