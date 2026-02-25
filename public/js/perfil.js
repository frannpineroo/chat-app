let socket = io();

let miId = null;

const lista = document.getElementById('mensajes');
const input = document.getElementById('inputMensaje');
const boton = document.getElementById('btnEnviar');

// Eventos de conexion
socket.on('connect', () => {
    console.log('Conectado al servidor');
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
});

socket.on('usuario', ( data ) => {
    miId = data.id;
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
    console.log('data.userId:', data.userId, typeof data.userId);
    console.log('miId:', miId, typeof miId);
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
    let li = document.getElementById(`mensaje-${ data.id }`);
    
    if (li) {
        li.innerHTML = `
            <span class="texto">
                ${data.nombre}: ${data.info}
                ${data.editado ? '<span class="editado">(editado)</span>' : ''}
            </span>
            ${Number(data.userId) === Number(miId)
                ? `<button onclick="editarMensaje(${data.id})">✏️</button>`
                : ''}
        `;
        return;
    }

    li = document.createElement('li');
    li.id = `mensaje-${ data.id }`;

    li.innerHTML = `
        <span class="texto">
            ${ data.nombre }: ${ data.info }
            ${ data.editado ? '<span class="editado">(editado)</span>' : '' }
        </span>
        ${Number(data.userId) === Number(miId)
            ? `<button onclick="editarMensaje(${data.id})">✏️</button>`
            : ''}
    `;

    lista.appendChild(li);
}

// Editar mensaje 
function editarMensaje( mensajeId ) {
    const nuevoInfo = prompt('Edita tu mensaje:');
    if ( nuevoInfo && nuevoInfo.trim() !== '') {
        socket.emit('editarMensaje', { mensajeId, nuevoInfo });
    }
}