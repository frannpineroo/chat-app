let socket = io();

let miId = null;

const lista = document.getElementById('mensajes');
const input = document.getElementById('inputMensaje');
const boton = document.getElementById('btnEnviar');

let mensajesPendientes = null;

// Eventos de conexion
socket.on('connect', () => {
    console.log('Conectado al servidor');
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
});

socket.on('usuario', (data) => {
    miId = data.id;

    if (mensajesPendientes) {
        lista.innerHTML = '';
        mensajesPendientes.forEach(mensaje => agregarMensajeAlDOM(mensaje));
        mensajesPendientes = null;
    }
});

// Carga inicial de mensajes
socket.on('cargarMensajes', (mensajes) => {
    if (!miId) {
        // Si el usuario todavía no llegó, guardar los mensajes para después
        mensajesPendientes = mensajes;
        return;
    }
    lista.innerHTML = '';
    mensajes.forEach(mensaje => agregarMensajeAlDOM(mensaje));
});

// Enviar mensaje
boton.addEventListener('click', () => {
    const mensaje = input.value.trim();

    if ( mensaje.trim() !== '') {
        socket.emit('mensaje', { info: mensaje, chatId: 1});
        input.value = '';
    } 
});

// Recibir mensaje nuevo
socket.on('mensaje', ( data ) => {
    agregarMensajeAlDOM( data );
});

// Recibir mensaje editado
socket.on('mensajeEditado', ( data ) => {
    agregarMensajeAlDOM( data.mensajeActualizado );
    // const mensaje = data.mensajeActualizado;

    // const li = document.getElementById(`mensaje-${ mensaje.id }`);

    // if ( li ) {
    //     li.querySelector('.texto').innerHTML = `
    //     ${ mensaje.nombre }: ${ mensaje.info } 
    //     <span class="editado">(editado)</span>`;
    // }
});

// Agregar Mensaje al DOM
function agregarMensajeAlDOM( data ) {
    const esMio = Number(data.userId) === Number(miId);

    let div = document.getElementById(`mensaje-${ data.id }`);
    
    const contenido = `
        <div class="chat-header">
            ${data.nombre}
        </div>
        <div class="chat-bubble ${esMio ? 'chat-bubble-primary' : ''}">
            ${data.info}
            ${data.editado ? '<span class="text-xs opacity-60">(editado)</span>' : ''}
        </div>
        ${esMio ? `
            <div class="chat-footer flex gap-2 mt-1">
                <button onclick="editarMensaje(${data.id})" class="btn btn-xs">✏️</button>
                <button onclick="borrarMensaje(${data.id})" class="btn btn-xs btn-error">🗑️</button>
            </div>
        ` : ''}
    `;

    if (div) {
        div.innerHTML = contenido;
        return;
    }

    div = document.createElement('div');
    div.id = `mensaje-${data.id}`;
    div.className = `chat ${esMio ? 'chat-end' : 'chat-start'}`;
    div.innerHTML = contenido;

    lista.appendChild(div);
}

// Editar mensaje 
function editarMensaje( mensajeId ) {
    const nuevoInfo = prompt('Edita tu mensaje:');
    if ( nuevoInfo && nuevoInfo.trim() !== '') {
        socket.emit('editarMensaje', { mensajeId, nuevoInfo });
    }
}

function borrarMensaje( mensajeId ) {
    if ( confirm('¿Estás seguro de que quieres borrar este mensaje?') ) {
        socket.emit('borrarMensaje', { mensajeId });
    }
}

socket.on('mensajeBorrado', ( data ) => {
    const li = document.getElementById(`mensaje-${ data.mensajeId }`);
    if ( li ) {
        li.remove();
    }
})