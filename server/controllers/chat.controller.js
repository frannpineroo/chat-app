const chatServicio = require('../services/chat.servicio');

class ChatController {
    async obtenerOCrearChatPrivado( req, res ) {
        try {

            const usuarioLogueadoId = req.usuario.id; // viene del middleware de autenticación
            const { usuarioDestinoId } = req.body;

            const chat = await chatServicio.obtenerOCrearChatPrivado(
                usuarioLogueadoId,
                usuarioDestinoId
            );

            res.json({ chatId: chat.id });
        } catch ( error) {
            console.error(error.message);
            res.status(500).json({ error: "Error al crear el chat" });
        }
    }
}

module.exports = new ChatController();