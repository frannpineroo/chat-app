const prisma = require('../prisma/client');
const Repositorio = require('./Repositorio');

class UsuarioRepositorio extends Repositorio {
    constructor() {
        super(prisma.usuario);
    }
    async buscarUsuarioPorNombre (nombre) {
        if (!nombre || nombre.trim() === "") {
            return []; }

        const termino = nombre.trim();
        return await prisma.usuario.findMany({
            where: { 
                OR: [
                {
                    nombre: {
                        contains: termino,
                        mode: "insensitive"
                    }
                },
                {
                    apellido: {
                        contains: termino,
                        mode: "insensitive"
                    }
                }]
            }
  })
}
}
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
        where: { id }
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
    eliminarUsuario,
    UsuarioRepositorio
}