
//CARGA DE COLUMNA DE CHATS
function cargarSeccionChat() {
    fetch("SeccionChat.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar SeccionChat.html");
            }
            return response.text();
        })
        .then(html => {
            document.querySelector(".chats").innerHTML = html;
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

let chatIdSeleccionado = 1;
let showNotifications = false;

const chats = [
    { id: 1, nombre: "Chat 1" },
    { id: 2, nombre: "Chat 2" },
    { id: 3, nombre: "Chat 3" }
];

const notifications = [
    { chatId: 2, title: "Nuevo mensaje", message: "Te escribieron en Chat 2", time: "10:30", read: false },
    { chatId: 3, title: "Nuevo mensaje", message: "Mensaje en Chat 3", time: "11:15", read: false },
    { chatId: 1, title: "Recordatorio", message: "Revisa Chat 1", time: "12:00", read: true }
];

function renderChats() {
    const chatList = document.querySelector(".chats");
    if (!chatList) {
        console.error("No se encontró el contenedor de chats");
        return;
    }
    chatList.innerHTML = "";

    chats.forEach(chat => {
        const div = document.createElement("div");
        div.className = "chat-item";
        div.textContent = chat.nombre;
        div.onclick = () => cambiarChat(chat.id);
        chatList.appendChild(div);
    });
}

function renderMensajes() {
    const messageSection = document.getElementById("messageSection");
    messageSection.innerHTML = `<h4>Chat seleccionado: ${chatIdSeleccionado}</h4>`;
}

function renderNotificaciones() {
    const contenedor = document.getElementById("notificaciones");
    contenedor.innerHTML = "";

    notifications.forEach(n => {
        const div = document.createElement("div");
        div.style.padding = "8px";
        div.style.marginBottom = "5px";
        div.style.background = n.read ? "#e0e0e0" : "#ffffff";
        div.style.cursor = "pointer";

        div.innerHTML = `
            <strong>${n.title}</strong><br>
            ${n.message}<br>
            <small>${n.time}</small>
        `;

        div.onclick = () => abrirChatDesdeNotificacion(n.chatId);
        contenedor.appendChild(div);
    });
}

// =======================
// FUNCIONES (equivalente a métodos Blazor)
// =======================

function cambiarChat(chatId) {
    chatIdSeleccionado = chatId;
    renderMensajes();
}

function toggleNotifications() {
    showNotifications = !showNotifications;
    actualizarVisibilidadNotificaciones();
}

function abrirChatDesdeNotificacion(chatId) {
    chatIdSeleccionado = chatId;
    showNotifications = false;
    renderMensajes();
    actualizarVisibilidadNotificaciones();
}

function cerrarNotificaciones() {
    showNotifications = false;
    actualizarVisibilidadNotificaciones();
}

function actualizarVisibilidadNotificaciones() {
    const panel = document.getElementById("notificaciones");
    panel.className = "seccion-notificaciones " + (showNotifications ? "show" : "hide");
}

// =======================
// INIT
// =======================

renderChats();
renderMensajes();
renderNotificaciones();

