const mensajeServicio = require('../services/mensaje.servicio');

const listarPorChat = async ( req, res ) => {
    try {
        const { chatId } = req.params;
        console.log('1. chatId recibido:', chatId);

        if (isNaN(chatId)) {
            return res.status(400).json({ error: "chatId inválido" });
        }

        console.log('2. Llamando al servicio...');
        const mensajes = await mensajeServicio.listarPorChat(parseInt(chatId));
        console.log('3. Mensajes obtenidos:', mensajes.length);

        const mensajesFormateados = mensajes.map( msg => ({
            id: msg.id,
            info: msg.info,
            userId: msg.userId,
            nombre: msg.usuario.nombre,
            editado: msg.editado ?? false,
            enviadoEn: msg.enviadoEn
        }));

        console.log('4. Enviando respuesta...');
        res.json( mensajesFormateados );
    } catch ( error ) {
        console.error('Error en listarPorChat:', error);
        res.status(500).json({ error: "Error al listar mensajes" });
    }
};

module.exports = {
    listarPorChat
}