const UsuarioRepo = require('../repositories/usuario.repositorio');

const registrarUsuario = async ( data ) => {
    //validar mail
    const existente = await UsuarioRepo.obtenerUsuarioPorEmail( data.email );

    if ( existente ) {
        throw new Error('El usuario ya existe');
    }

    return await UsuarioRepo.crearUsuario( data );
}

module.exports = {
    registrarUsuario
}