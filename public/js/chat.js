const chatId = window.location.pathname.split('/')[2];
const token = localStorage.getItem('token');

// Socket para mensajes en tiempo real
const socket = io({ auth: { token } });

// Decodificar el usuario actual del token
function getUsuarioIdDesdeToken(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id || payload.userId || payload.sub;
    } catch {
        return null;
    }
}

const miId = getUsuarioIdDesdeToken(token);

async function cargarMensajes() {
    const res = await fetch(`/api/mensajes/${chatId}`, {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) {
        throw new Error("Error al cargar mensajes");
    }
    const mensajes = await res.json();
    renderizarMensajes(mensajes);
}

function renderizarMensajes(mensajes) {
    const contenedor = document.getElementById('mensajes');
    contenedor.innerHTML = '';

    mensajes.forEach(msg => {
        const esMio = Number(msg.userId) === Number(miId);

        const burbuja = document.createElement('div');
        burbuja.id = `mensaje-${msg.id}`;
        burbuja.className = `chat ${esMio ? 'chat-end' : 'chat-start'}`;

        burbuja.innerHTML = `
                    <div class="chat-header text-xs opacity-70">
                        ${msg.nombre}
                    </div>

                    <div class="chat-bubble ${esMio ? 'chat-bubble-primary' : ''}">
                        ${msg.info}
                        ${msg.editado ? '<span class="text-xs opacity-60">(editado)</span>' : ''}
                    </div>

                    <div class="chat-footer opacity-50 text-xs">
                        ${new Date(msg.enviadoEn).toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit'
        })}
                    </div>

                    ${esMio ? `
                        <div class="flex gap-2 mt-1">
                            <button onclick="editarMensaje(${msg.id})" class="btn btn-xs">✏️</button>
                            <button onclick="borrarMensaje(${msg.id})" class="btn btn-xs btn-error">🗑️</button>
                        </div>
                    ` : ''}
                `;

        contenedor.appendChild(burbuja);
    });

    contenedor.scrollTop = contenedor.scrollHeight;
}

function enviarMensaje() {
    const input = document.getElementById('inputMensaje');
    const info = input.value.trim();
    if (!info) return;

    socket.emit('enviarMensajePrivado', {
        chatId,
        info
    });

    input.value = '';
}

function agregarMensaje(msg) {
    const contenedor = document.getElementById('mensajes');
    const esMio = Number(msg.userId) === Number(miId);

    const burbuja = document.createElement('div');
    burbuja.id = `mensaje-${msg.id}`;
    burbuja.className = `chat ${esMio ? 'chat-end' : 'chat-start'}`;

    burbuja.innerHTML = `
                <div class="chat-header text-xs opacity-70">
                    ${msg.nombre}
                </div>

                <div class="chat-bubble ${esMio ? 'chat-bubble-primary' : ''}">
                    ${msg.info}
                </div>

                <div class="chat-footer opacity-50 text-xs">
                    ${new Date(msg.enviadoEn).toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
    })}
                </div>
            `;

    contenedor.appendChild(burbuja);
    contenedor.scrollTop = contenedor.scrollHeight;
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

socket.on('mensajePrivadoBorrado', (data) => {
    const mensaje = document.getElementById(`mensaje-${data.mensajeId}`);
    if (mensaje) mensaje.remove();
});

document.getElementById('btnEnviar').addEventListener('click', enviarMensaje);

document.getElementById('inputMensaje').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') enviarMensaje();
});

socket.emit('unirseChat', chatId);

socket.on('nuevoMensajePrivado', (mensaje) => {
    agregarMensaje(mensaje);
});

// Carga inicial
cargarMensajes();