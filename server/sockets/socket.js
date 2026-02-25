const { io } = require('../server');
const jwt = require('jsonwebtoken');

const usuarioServicio = require('../services/usuario.servicio');
const mensajeServicio = require('../services/mensaje.servicio');

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
io.on('connection', async (socket) => {

    console.log('Usuario conectado: ', socket.usuario);
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
            chatId
        );

        io.emit('mensaje', {
            id: mensajeGuardado.id,
            info: mensajeGuardado.info,
            userId: mensajeGuardado.userId,
            nombre: socket.usuario.nombre,
        });

        // Actualiza el mensaje en la base de datos
        socket.on('editarMensaje', async ( data ) => {
            const { mensajeId, nuevoInfo } = data;

            const mensajeActualizado = await mensajeServicio.editarMensaje(
                mensajeId,
                nuevoInfo,
                socket.usuario.id,
                socket.usuario.nombre
            );

            io.emit('mensajeEditado', { 
                mensajeActualizado: {
                    id: mensajeActualizado.id,
                    info: mensajeActualizado.info,
                    editado: mensajeActualizado.editado,
                    userId: mensajeActualizado.userId,
                    nombre: mensajeActualizado.usuario.nombre
                }
            });
        });

        // Archiva el mensaje en la base de datos
        socket.on('borrarMensaje', async ( data ) => {
            const { mensajeId } = data;

            await mensajeServicio.borrarMensaje(
                mensajeId,
                socket.usuario.id
            );

            io.emit('mensajeBorrado', { mensajeId });
        });
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado', socket.usuario);
    });

});