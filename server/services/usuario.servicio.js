const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioRepo = require('../repositories/usuario.repositorio');

const registrarUsuario = async ({ nombre, apellido, email, contra } ) => {
    //validar mail
    const existente = await usuarioRepo.obtenerUsuarioPorEmail( email );

    if ( existente ) {
        throw new Error('El usuario ya existe');
    }

    // hashear contraseña
    const contraHash = await bcrypt.hash( contra, 10 );

    // crear usuario
    const nuevoUsuario = await usuarioRepo.crearUsuario({
        nombre,
        apellido,
        email,
        contra: contraHash
    });

    return {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
    };
};

const loginUsuario = async ( email, contra ) => {

    const usuario = await usuarioRepo.obtenerUsuarioPorEmail( email );

    if ( !usuario ) {
        throw new Error('Usuario no encontrado');
    }

    const contraValida = await bcrypt.compare( contra, usuario.contra );

    if ( !contraValida ) {
        throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
        token, 
        usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email
        }
    };
};

module.exports = {
    registrarUsuario,
    loginUsuario
}