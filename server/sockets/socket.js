const { io } = require('../server');
const jwt = require('jsonwebtoken');

const mensajeServicio = require('../services/mensaje.servicio');
const prisma = require('../prisma/client');

// Middleware para validar el token JWT
io.use(( socket, next ) => {
    
    const cookie = socket.handshake.headers.cookie;

    if ( !cookie ) {
        return next( new Error('No autenticado'));
    }

    const token = cookie
        .split('; ')
        .find( c => c.startsWith('token='))
        ?.split('=')[1];

    if ( !token ) {
        return next( new Error('Token no encontrado'));
    }

    try {
        const decoded = jwt.verify( token, process.env.JWT_SECRET );

        socket.usuario = decoded; // guarda la info del usuario en el socket
        next();
    } catch ( error ) {
        return next( new Error('Token inválido'));
    }
});

// Conexion a Socket.IO
io.on('connection',  (socket) => {

    // Unirse a sala especifica
    socket.on('unirseChat', async ( chatId) => {
        const miembro = await prisma.chatMiembro.findFirst({
            where: {
                chatId: Number(chatId),
                usuarioId: socket.usuario.id
            }
        });

        if ( !miembro ) return; 

        socket.join(`chat_${chatId}`);
        console.log(`Usuario ${socket.usuario.nombre} se unió al chat ${chatId}`);
    });

    // Enviar mensaje privado
    socket.on('enviarMensajePrivado', async ({ chatId, info }) => {
        
        const miembro = await prisma.chatMiembro.findFirst({
            where: {
                chatId: Number(chatId),
                usuarioId: socket.usuario.id
            }
        });

        if ( !miembro ) return;

        const mensajeGuardado = await mensajeServicio.guardarMensaje(
            info,
            socket.usuario.id,
            Number(chatId)
        );

        io.to(`chat_${chatId}`).emit('nuevoMensajePrivado', {
            id: mensajeGuardado.id,
            info: mensajeGuardado.info,
            chatId: mensajeGuardado.chatId,
            userId: mensajeGuardado.userId,
            nombre: socket.usuario.nombre,
            enviadoEn: mensajeGuardado.enviadoEn
        });
    });

    // Actualiza el mensaje en la base de datos
    socket.on('editarMensaje', async ({ mensajeId, nuevoContenido, chatId }) => {

        const mensajeActualizado = await mensajeServicio.editarMensaje(
            mensajeId,
            nuevoContenido,
            socket.usuario.id
        );

        io.to(`chat_${chatId}`).emit('mensajeEditado', { 
                id: mensajeActualizado.id,
                info: mensajeActualizado.info,
                editado: mensajeActualizado.editado,
                userId: mensajeActualizado.userId,
                nombre: mensajeActualizado.usuario.nombre
        });
    });

    // Archiva el mensaje en la base de datos
    socket.on('borrarMensaje', async ( data ) => {
        const { mensajeId } = data;

        await mensajeServicio.borrarMensaje(
            mensajeId,
            socket.usuario.id
        );

        io.to(`chat_${data.chatId}`).emit('mensajeBorrado', { mensajeId });
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado', socket.usuario);
    });

});