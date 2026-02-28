    var socket = io();

    socket.on('connect', function() {
        console.log('Conectado al servidor');

        socket.emit('crear-usuario', {
            nombre: 'Juan',
            apellido: 'Perez',
            email: 'juanperez@example.com',
            contra: 'contra1234'
        }, function( resp ) {
            console.log( 'Respuesta del servidor:', resp );
        });
    });