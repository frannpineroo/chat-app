const { usuario } = require('../prisma/client');
const chatRepisorio = require('../repositories/chat.repositorio');

class ChatServicio {
    
    async obtenerOCrearChatPrivado( usuarioLogueadoId, usuarioDestinoId ) {
        let chat = await chatRepisorio.buscarChatPrivado(
            usuarioLogueadoId,
            usuarioDestinoId
        );

        if ( !chat ) {
            chat = await chatRepisorio.crearChatPrivado(
                usuarioLogueadoId,
                usuarioDestinoId
            );
        }

        return chat;
    }
}

module.exports = new ChatServicio();