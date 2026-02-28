const mensajeServicio = require('../services/mensaje.servicio');

const listarPorChat = async ( req, res ) => {
    try {
        const { chatId } = req.params;

        if (isNaN(chatId)) {
            return res.status(400).json({ error: "chatId inválido" });
        }

        const mensajes = await mensajeServicio.listarPorChat(parseInt(chatId));

        const mensajesFormateados = mensajes.map( msg => ({
            id: msg.id,
            info: msg.info,
            userId: msg.userId,
            nombre: msg.usuario.nombre,
            editado: msg.editado ?? false
        }));

        res.json( mensajesFormateados );
    } catch ( error ) {
        console.error(error.message);
        res.status(500).json({ error: "Error al listar mensajes" });
    }
};

module.exports = {
    listarPorChat
}