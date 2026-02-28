
let chatIdSeleccionado = null;
//let usuarioId = 1;
let usuarioId = localStorage.getItem("usuarioId");
//console.log("ID del usuario:", usuarioId);

let chats = [];
let listaChats = [];
let searchText = "";

document.addEventListener("DOMContentLoaded", () => {
    cargarChats();
    document.getElementById("searchForm").addEventListener("submit", buscarChats);
});

async function cargarChats() {
    try {
        const response = await fetch(`/chat/usuarios/${usuarioId}/chats`);
        const resultado = await response.json();

            chats = Array.isArray(resultado) ? resultado : [];
            renderChats();

    } catch (e) {
        console.error("ERROR:", e);
        chats = [];
    }
}

// FILTROS

function buscarChats(chat) {
    if (!searchText) return true;

    return chat.nombreChat.toLowerCase().includes(searchText.toLowerCase())
        || chat.id.toString().includes(searchText);
}

function buscarChatsPrivados() {
    return chats.filter(c => !c.isGroup );
}

function buscarChatsGrupales() {
    return chats.filter(c => c.isGroup );
}

//RENDERIZADO

function renderChats() {
    renderChatsPrivados();
    renderChatsGrupales();
}

function renderChatsPrivados() {
    const container = document.getElementById("privateChats");
    container.innerHTML = "";

    buscarChatsPrivados().forEach(chat => {
        container.appendChild(crearItem(chat));
    });
}

function renderChatsGrupales() {
    const container = document.getElementById("groupChats");
    container.innerHTML = "";

    buscarChatsGrupales().forEach(chat => {
        container.appendChild(crearItem(chat));
    });
}

function crearItem(chat) {
    let previewText = "";

     if (chat.mensajes && chat.mensajes.length > 0) {
       previewText = chat.mensajes;
    }

    const div = document.createElement("div");
    div.className = "chat-item" + (chat.id === chatIdSeleccionado ? " active" : "");
    div.dataset.id = chat.id;
    div.onclick = () => enterChat(chat.id);

    div.innerHTML = `
        <span class="avatar">${getInitials(chat.nombreChat)}</span>
        <div class="chat-info">
            <p class="nombre">${chat.nombreChat}</p>
            <p class="preview">${previewText}</p>
        </div>
    `;

    return div;
}

// EVENTOS

function enterChat(chatId) {
    chatIdSeleccionado = chatId;
    //renderChats();
    // Aquí simula OnChatSelected.InvokeAsync
    console.log("Chat seleccionado:", chatId);
    // Limpiar la sección de mensajes
    lista.innerHTML = '<p>Cargando mensajes...</p>';

    // Pedir al servidor los mensajes de este chat
    socket.emit('cargarMensajesChat', { chatId });
}

async function buscarChats(e) {
    e.preventDefault();

    const filtro = document.getElementById("texto").value;

    try {
        const response = await fetch(`/chat/usuarios/${usuarioId}/filtro/${filtro}`);
        const resultado = await response.json();

            listaChats = resultado;
            mostrarResultados();

    } catch (e) {
        console.error("ERROR:", e.message);
    }
}

function mostrarResultados() {
    const container = document.getElementById("Resultados");
    container.innerHTML = "";

    listaChats.forEach(chat => {
        const div = crearItem(chat);
        container.appendChild(div);
    });
}

// UTILIDADES

function getInitials(nombreChat) {
    if (!nombreChat) return "?";

    const parts = nombreChat.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();

    return (parts[0][0] + parts[1][0]).toUpperCase();

}

//MENSAJES
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
    lista.scrollTop = lista.scrollHeight;
});

// Enviar mensaje
boton.addEventListener('click', () => {
    const mensaje = input.value.trim();

    if ( mensaje.trim() !== '') {
        socket.emit('mensaje', { info: mensaje, chatId: chatIdSeleccionado}); //id que viene de chat
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