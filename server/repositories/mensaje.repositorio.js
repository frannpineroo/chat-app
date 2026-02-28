const prisma = require('../prisma/client');

const crearMensaje = async ( data ) => {
    return await prisma.mensaje.create({
        data: {
            info: data.info,
            userId: data.userId,
            chatId: data.chatId // Asignamos un chatId fijo por ahora, luego se puede mejorar para manejar múltiples chats
        }
    });
};

const obtenerMensajes = async (chatId) => {
    return await prisma.mensaje.findMany({
        where: { 
            chatId: chatId,
            arhivado: false 
        },
        include: { usuario: true },
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
        include: { usuario: true }
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
    editarMensaje,
    borrarMensaje
}