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

    let token = cookie
        .split('; ')
        .find( c => c.startsWith('token='))
        ?.split('=')[1];

    
    if ( !token ) {
        token = socket.handshake.auth?.token;
    }

    if (!token) return next(new Error('No autenticado'));

    try {
        const decoded = jwt.verify( token, process.env.JWT_SECRET );

        socket.usuario = decoded; // guarda la info del usuario en el socket
        next();
    } catch ( error ) {
        return next( new Error('Token inválido'));
    }
});

// Conexion a Socket.IO
io.on('connection', async (socket) => {

    socket.emit('usuario', { id: socket.usuario.id })

    // Cargar mensajes existentes
    const mensajes = await mensajeServicio.listarMensajes();
    const mensajesFormateados = mensajes.map( m => ({
        id: m.id,
        info: m.info,
        editado: m.editado ?? false,
        userId: m.userId,
        nombre: m.usuario.nombre
    }));
    socket.emit('cargarMensajes', mensajesFormateados);

    socket.on('mensaje', async ( data ) => {
        const { info, chatId } = data;

        // Guarda el mensaje en la base de datos
        const mensajeGuardado = await mensajeServicio.guardarMensaje(
            info,
            socket.usuario.id,
            Number(chatId)
        );

        io.emit('mensaje', {
            id: mensajeGuardado.id,
            info: mensajeGuardado.info,
            chatId: mensajeGuardado.chatId,
            userId: mensajeGuardado.userId,
            nombre: socket.usuario.nombre,
            enviadoEn: mensajeGuardado.enviadoEn
        });
    });

    // Actualiza el mensaje en la base de datos
    socket.on('editarMensajePrivado', async ({ mensajeId, nuevoContenido, chatId }) => {

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
    socket.on('borrarMensajePrivado', async ( data ) => {
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