
// Funciones de navegación
function volverPrincipal() {
    window.location.href = "Principal.html";
}

function registrarUsuario() {
        window.location.href = "index.html";
}

let usuarios = [];
let nombre = "";


document.addEventListener("DOMContentLoaded", () => {
    verUsuarios();
});

async function verUsuarios() {
    try {
        const resp = await fetch("/usuarios/");

        if (!resp.ok) throw new Error("Error al cargar usuarios");

        const usuarios = await resp.json();
        renderUsuarios(usuarios);

    } catch (error) {
        console.error("Error:", error.message);
    }
}

function renderUsuarios(usuarios) {
        const tbody = document.getElementById("tbodyUsuarios");
        tbody.innerHTML = "";

        if (!Array.isArray(usuarios) || usuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center">No hay usuarios</td></tr>`;
        return;
        }

        usuarios.forEach(usuario => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-secondary text-center text-uppercase me-2" 
                        style="width:35px; height:35px; line-height:35px;">
                        ${usuario.Id}
                    </div>
                    <span>${usuario.nombre} ${usuario.apellido}</span>
                </div>
            </td>
            <td>${usuario.email}</td>
            <td>${usuario.rolesUsuarios == 1 ? "Administrador" : "Usuario"}</td>
            <td>
                ${usuario.IsActive === true ? '<span class="badge bg-success">Activo</span>' : 
                  usuario.IsActive === false ? '<span class="badge bg-secondary">Inactivo</span>' :
                  `<span class="badge bg-danger">${usuario.IsActive}</span>`}
            </td>
            <td>
                ${usuario.IsActive === true 
                    ? `<button class="btn btn-outline-light btn-sm me-2" onclick="desactivarUsuario(${usuario.Id})"><i class="bi bi-arrow-repeat"></i> Desactivar</button>`
                    : `<button class="btn btn-outline-light btn-sm me-2" onclick="activarUsuario(${usuario.Id})"><i class="bi bi-arrow-repeat"></i> Activar</button>`}
                <button class="btn btn-outline-light btn-sm me-2"><i class="bi bi-chat-dots"></i> Ver chats</button>
            </td>
            `;

            tbody.appendChild(tr);
        });
    }

// Filtrado
    function filtrarUsuarios(tipo) {
        if(tipo === 'activo') renderUsuarios(usuarios.filter(u => u.IsActive === true));
        else if(tipo === 'inactivo') renderUsuarios(usuarios.filter(u => u.IsActive === false));
        else renderUsuarios(usuarios);
    }

async function buscarUsuarios(event) {
    event.preventDefault();

     nombre = document.getElementById("inputBuscar").value.trim();

    try {
        const resp = await fetch(`/usuarios/${encodeURIComponent(nombre)}`);
        if (!resp.ok) throw new Error("Error al buscar");

        const data = await resp.json();
        const resultados = Array.isArray(data) ? data : [];
        renderUsuarios(resultados);

    } catch (error) {
        console.error("No se pudo cargar usuarios");
    }
}


// ===============================
// FILTRAR ACTIVOS
// ===============================
//async function filtrarUsuarios1(tipo) {
//    try {
//        let endpoint = "";
//
//        if (tipo === "activos") {
//            endpoint = "api/Usuario/activos";
//        } else if (tipo === "inactivos") {
//            endpoint = "api/Usuario/inactivos";
//        } else {
//            return verUsuarios();
//        }
//
//        const resp = await fetch(endpoint);
//        if (!resp.ok) throw new Error("Error al filtrar");
//
//        usuarios = await resp.json();
//        renderUsuarios(usuarios);
//
//    } catch (error) {
//        console.error("Error:", error.message);
//    }
//}



// ===============================
// DESACTIVAR USUARIO
// ===============================
async function desactivarUsuario(id) {
    try {
        const resp = await fetch(`/usuarios/${id}`, {
            method: "PUT"
        });

        if (!resp.ok) throw new Error("No se pudo desactivar");

        await verUsuarios(); 

    } catch (error) {
        console.error(error.message);
    }
}

// ===============================
// ACTIVAR USUARIO
// ===============================
async function activarUsuario(id) {
    try {
        const resp = await fetch(`/usuarios/${id}`, {
            method: "PUT"
        });

        if (!resp.ok) throw new Error("No se pudo activar");

        await verUsuarios();

    } catch (error) {
        console.error(error.message);
    }
}