const { io } = require('../server');
const jwt = require('jsonwebtoken');
const usuarioServicio = require('../services/usuario.servicio');

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
io.on('connection', (socket) => {

    console.log('Usuario conectado: ', socket.usuario);

    socket.on('mensaje', ( texto ) => {

        io.emit('mensaje', {
            nombre: socket.usuario.nombre,
            mensaje: texto
        });

    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado', socket.usuario);
    });

});