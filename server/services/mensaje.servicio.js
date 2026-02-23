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

const editarMensaje = async ( mensajeId, nuevoInfo, userId ) => {
    return await mensajeRepo.editarMensaje( mensajeId, nuevoInfo, userId );
}

module.exports = {
    guardarMensaje,
    listarMensajes,
    editarMensaje
}