const prisma = require('../prisma/client');

const crearMensaje = async ( data ) => {
    return await prisma.mensaje.create({
        data: {
            info: data.info,
            userId: data.userId,
            chatId: data.chatId
        }
    });
};

const obtenerMensajes = async () => {
    return await prisma.mensaje.findMany({
        where: { arhivado: false },
        include: { usuario: true },
        orderBy: { enviadoEn: 'asc' }
    });
};

const obtenerMensajesPorChat = async ( chatId ) => {
    console.log('Prisma: buscando mensajes para chatId:', chatId, typeof chatId);
    return await prisma.mensaje.findMany({
        where: {
            chatId: chatId,
            arhivado: false
        },
        select: {
            id: true,
            info: true,
            userId: true,
            enviadoEn: true,
            editado: true,
            usuario: {
                select: {
                    nombre: true
                }
            }
        },
        orderBy: { enviadoEn: 'asc' }
    });
};

const editarMensaje = async ( mensajeId, nuevoInfo, userId ) => {
    return await prisma.mensaje.update({
        where: {
            id: mensajeId,
            userId: userId // seguridad: solo el autor del mensaje puede editarlo
        }, 
        data: { 
            info: nuevoInfo,
            editado: true
        },
        include: { 
            usuario: {
                select: { nombre: true }
            } 
        }
    });
};

const borrarMensaje = async ( mensajeId, userId ) => {
    return await prisma.mensaje.update({
        where: {
            id: mensajeId,
            userId: userId // seguridad: solo el autor del mensaje puede eliminarlo
        },
        data: {
            arhivado: true
        }
    })
} 

module.exports = {
    crearMensaje,
    obtenerMensajes,
    obtenerMensajesPorChat,
    editarMensaje,
    borrarMensaje
}