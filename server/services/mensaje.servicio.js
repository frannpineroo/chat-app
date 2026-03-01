const mensajeRepo = require('../repositories/mensaje.repositorio');

const guardarMensaje = async ( info, userId, chatId ) => {
    return await mensajeRepo.crearMensaje({
        info,
        userId,
        chatId
    });
};

const listarMensajes = async (chatId) => {
    return await mensajeRepo.obtenerMensajes(chatId);
};

const listarPorChat = async ( chatId ) => {
    return await mensajeRepo.obtenerMensajesPorChat( chatId );
}

const editarMensaje = async ( mensajeId, nuevoInfo, userId ) => {
    return await mensajeRepo.editarMensaje( mensajeId, nuevoInfo, userId );
}

const borrarMensaje = async ( mensajeId, userId ) => {
    return await mensajeRepo.borrarMensaje( mensajeId, userId );
}

module.exports = {
    guardarMensaje,
    listarMensajes,
    listarPorChat,
    editarMensaje,
    borrarMensaje
}