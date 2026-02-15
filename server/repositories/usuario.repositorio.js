const prisma = require('../prisma/client');

const crearUsuario = async (data) => {
    return await prisma.usuario.create({
        data
    })
}

const obtenerUsuarios = async () => {
    return await prisma.usuario.findMany();
}

const obtenerUsuarioPorId = async ( id ) => {
    return await prisma.usuario.findUnique({
        where: { id },
        data
    })
}

const obtenerUsuarioPorEmail = async (email) => {
  return await prisma.usuario.findUnique({
    where: { email }
  })
}

const actualizarUsuario = async ( id, data ) => {
    return await prisma.usuario.update({
        where: { id },
        data
    })
}

const eliminarUsuario = async ( id ) => {
    return await prisma.usuario.delete({
        where: { id }
    })
}

module.exports = {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuarioPorEmail,
    actualizarUsuario,
    eliminarUsuario
}