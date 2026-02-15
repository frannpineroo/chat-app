const { io } = require('../server');
const usuarioServicio = require('../services/usuario.servicio');

io.on('connection', (client) => {

    console.log('Usuario conectado');

    // Crear Usuario
    client.on('crear-usuario', async (data, callback) => {
        try {
            const usuario = await usuarioServicio.registrarUsuario( data );

            callback({
                ok: true,
                usuario
            });
        } catch ( error ) {
            callback({
                ok: false,
                mensaje: error.message
            })
        }
    });

    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

});