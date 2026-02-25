const prisma = require('../prisma/client');

const crearMensaje = async ( data ) => {
    return await prisma.mensaje.create({
        data: {
            info: data.info,
            userId: data.userId,
            chatId: 1 // Asignamos un chatId fijo por ahora, luego se puede mejorar para manejar múltiples chats
        }
    });
};

const obtenerMensajes = async () => {
    return await prisma.mensaje.findMany({
        include: { usuario: true },
        orderBy: { createdAt: 'asc' }
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

module.exports = {
    crearMensaje,
    obtenerMensajes,
    editarMensaje
}