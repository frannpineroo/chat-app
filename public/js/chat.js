const chatId = window.location.pathname.split('/')[2];

let miId = null;

// Obtener el usuario actual desde el backend
async function obtenerMiUsuario() {
    console.log('Obteniendo usuario...');
    const res = await fetch('/auth/me', { credentials: 'include' });
    console.log('Status /auth/me:', res.status);
    if (!res.ok) return window.location.href = '/login';
    const data = await res.json();
    console.log('Usuario obtenido:', data);
    miId = data.id;
}


const socket = io({ withCredentials: true });

// async function cargarMensajes() {
//     try {
//         console.log('Cargando mensajes para chatId:', chatId);
//         const controller = new AbortController();
//         const timeout = setTimeout(() => controller.abort(), 5000);
        
//         const res = await fetch(`/api/mensajes/${chatId}`, {
//             credentials: 'include',
//             signal: controller.signal
//         });
//         clearTimeout(timeout);
//         console.log('Status:', res.status);
//         const mensajes = await res.json();
//         console.log('Mensajes:', mensajes);
//         renderizarMensajes(mensajes);
//     } catch(err) {
//         console.error('Error en cargarMensajes:', err);
//     }
// }

socket.on('cargarMensajesPrivado', (mensajes) => {
    console.log('Mensajes recibidos por socket:', mensajes);
    renderizarMensajes(mensajes);
});

function renderizarMensajes(mensajes) {
    const contenedor = document.getElementById('mensajes');
    contenedor.innerHTML = '';
    mensajes.forEach(msg => agregarMensajeAlDOM(msg));
    contenedor.scrollTop = contenedor.scrollHeight;
}

function agregarMensajeAlDOM(msg) {
    const contenedor = document.getElementById('mensajes');
    const esMio = Number(msg.userId) === Number(miId);

    let burbuja = document.getElementById(`mensaje-${msg.id}`);

    const contenido = `
        <div class="chat-header text-xs opacity-70">
            ${msg.nombre}
        </div>
        <div class="chat-bubble ${esMio ? 'chat-bubble-primary' : ''}">
            ${msg.info}
            ${msg.editado ? '<span class="text-xs opacity-60">(editado)</span>' : ''}
        </div>
        <div class="chat-footer opacity-50 text-xs">
            ${new Date(msg.enviadoEn).toLocaleTimeString('es-AR', {
                hour: '2-digit', minute: '2-digit'
            })}
        </div>
        ${esMio ? `
            <div class="flex gap-2 mt-1">
                <button onclick="editarMensaje(${msg.id})" class="btn btn-xs">✏️</button>
                <button onclick="borrarMensaje(${msg.id})" class="btn btn-xs btn-error">🗑️</button>
            </div>
        ` : ''}
    `;

    if (burbuja) {
        burbuja.innerHTML = contenido;
        return;
    }

    burbuja = document.createElement('div');
    burbuja.id = `mensaje-${msg.id}`;
    burbuja.className = `chat ${esMio ? 'chat-end' : 'chat-start'}`;
    burbuja.innerHTML = contenido;

    contenedor.appendChild(burbuja);
    contenedor.scrollTop = contenedor.scrollHeight;
}

function enviarMensaje() {
    const input = document.getElementById('inputMensaje');
    const info = input.value.trim();
    if (!info) return;
    socket.emit('enviarMensajePrivado', { chatId, info });
    input.value = '';
}

function editarMensaje(mensajeId) {
    const nuevoInfo = prompt('Edita tu mensaje:');
    if (nuevoInfo && nuevoInfo.trim() !== '') {
        socket.emit('editarMensajePrivado', { mensajeId, nuevoInfo, chatId });
    }
}

function borrarMensaje(mensajeId) {
    if (confirm('¿Seguro que quieres borrar este mensaje?')) {
        socket.emit('borrarMensajePrivado', { mensajeId, chatId });
    }
}

socket.on('nuevoMensajePrivado', (mensaje) => {
    agregarMensajeAlDOM(mensaje);
});

socket.on('mensajePrivadoEditado', (data) => {
    agregarMensajeAlDOM(data.mensajeActualizado);
});

socket.on('mensajePrivadoBorrado', (data) => {
    const el = document.getElementById(`mensaje-${data.mensajeId}`);
    if (el) el.remove();
});

document.getElementById('btnEnviar').addEventListener('click', enviarMensaje);
document.getElementById('inputMensaje').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') enviarMensaje();
});

obtenerMiUsuario().then(() => {
    // socket.emit('unirseChat', chatId);
    socket.emit('unirseChat', chatId);
});

window.editarMensaje = editarMensaje;
window.borrarMensaje = borrarMensaje;