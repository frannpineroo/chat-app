const mensajeRepo = require('../repositories/mensaje.repositorio');

const guardarMensaje = async ( info, userId, chatId ) => {
    return await mensajeRepo.crearMensaje({
        info,
        userId,
        chatId
    });
};

const listarMensajes = async () => {
    return await mensajeRepo.obtenerMensajes();
};

module.exports = {
    guardarMensaje,
    listarMensajes
}