const chatIcon = document.getElementById("chatIcon");
const menu = document.getElementById("menu");

// Evitar que clicks dentro del menú lo cierren
chatIcon.addEventListener("click", e => {
    e.stopPropagation();
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
});
menu.addEventListener("click", e => e.stopPropagation());

// Cerrar menú si se hace click fuera
document.addEventListener("click", () => {
    menu.style.display = "none";
});


//Agregado

//document.getElementById("chatIcon").onclick = () => {
//    const menu = document.getElementById("menu");
//    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
//};

function nuevoChat(){
    menu.style.display="none";
    document.getElementById("individualModal").style.display="flex";
}

function nuevoGrupo(){
    menu.style.display="none";
    document.getElementById("groupModal").style.display="flex";
}

function cerrarCuadro(){
    document.getElementById("individualModal").style.display="none";
    document.getElementById("groupModal").style.display="none";
    selectedUsers=[];
    document.getElementById("usuariosElegidos").innerHTML="";
}

//METODOS PARA CHAT INDIVIDUAL
let chatss = [];
let selectedUsers = [];
let usuarioSeleccionado = null;

async function buscarUsuarios(){
    const nombre = document.getElementById("buscarNombre").value;

    try {
        const response = await fetch(`/usuarios/${encodeURIComponent(nombre)}`);
        const usuarios = await response.json();
        
        mostrarResultadosBusqueda(usuarios);

    } catch (e) {
        console.error("ERROR:", e.message);
    }
}

function mostrarResultadosBusqueda(usuarios){
    const container = document.getElementById("ResultadosIndividual");
    container.innerHTML = "";

    if(usuarios.length === 0){
        container.innerHTML = "<p>No se encontraron usuarios</p>";
        return;
    }

    usuarios.forEach(usuario => {
        const div = document.createElement("div");
        div.className = "userResult";
        div.textContent = usuario.nombre + " " + usuario.apellido;

        div.onclick = () => {
            usuarioSeleccionado = usuario;
            document.querySelectorAll(".userResult").forEach(el => el.classList.remove("active"));
            div.classList.add("active");
            //console.log("Usuario seleccionado:", usuarioSeleccionado);
        };
        container.appendChild(div);
    });
}

function addChat(usuarios){
    usuarios.forEach(usuario => {
        chatss.push(usuario);
    });
    renderChats();
    openChat(usuarios[0]);
}

function openChat(usuario){
    document.querySelectorAll(".chatItem").forEach(item=>{
        item.classList.remove("active");
        if(item.textContent===usuario.nombre + " " + usuario.apellido){
            item.classList.add("active");
        }
    });
    document.getElementById("chatWindow").innerHTML=
        "<h2>"+usuario.nombre + " " + usuario.apellido+"</h2><p>Escribe tu primer mensaje...</p>";
}
//HASTAAQUI

async function crearChat(e){ //REVISAR ESTE METODO CUANDO SE ADAPTE A LA PAGINA PRINCIPAL
    e.preventDefault();
    //const nombre = document.getElementById("individualSearch").value;

    try {
    if(!usuarioSeleccionado){
        alert("Selecciona un usuario primero");
        return;
    }
    const existe = chatss.find(u => u.id === usuarioSeleccionado.id);

    if(existe){
        openChat(existe);
        cerrarCuadro();
        return;
    
        const response = await fetch(`/chats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ usuarioId: usuarioSeleccionado.id })
        });
        if(!response.ok){
            throw new Error("Error al crear el chat");
        }
        const nuevoChat = await response.json();

        chatss.push(nuevoChat);
        renderChats();
        openChat(nuevoChat);
        cerrarCuadro();

        usuarioSeleccionado = null;
        }
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}

//CREAR CHAT GRUPAL
async function buscarUsuariosGrupo(){

    const nombre = document.getElementById("buscarUsuarios").value;
    if(!nombre){
        mostrarResultadosBusquedaGrupo([]);
        return;
    }
    try {
        const response = await fetch(`/usuarios/${encodeURIComponent(nombre)}`);
        const usuarios = await response.json();
        if(!Array.isArray(usuarios)){
            console.error("La respuesta no es un array:", usuarios);
            mostrarResultadosBusquedaGrupo([]);
            return;
        }
        mostrarResultadosBusquedaGrupo(usuarios);

    } catch (e) {
        console.error("ERROR:", e.message);
    }
}

function mostrarResultadosBusquedaGrupo(usuarios){

    const container = document.getElementById("usuariosEncontrados");
    container.innerHTML = "";

    if(usuarios.length === 0){
        container.innerHTML = "<p>No se encontraron usuarios</p>";
        return;
    }

    usuarios.forEach(usuario => {

        const div = document.createElement("div");
        div.className = "userResult";
        div.textContent = usuario.nombre + " " + usuario.apellido;

        div.addEventListener("click", function(){

            const id = Number(usuario.id);

            if(!selectedUsers.includes(id)){
                selectedUsers.push(id);
                this.classList.add("active");
            } else {
                selectedUsers = selectedUsers.filter(u => u !== id);
                this.classList.remove("active");
            }

            console.log("Usuarios seleccionados:", selectedUsers);
        });

        container.appendChild(div);
    });
}

let nombreGrupo = "";
let isModerated = false;
async function createGroupChat(){  //REVISAR ESTE METODO CUANDO SE ADAPTE A LA PAGINA PRINCIPAL

    nombreGrupo = document.getElementById("nombreGrupo").value;
    isModerated = document.getElementById("isModerated").checked;

    if(!nombreGrupo){
        alert("Ingresa un nombre para el grupo");
        return;
    }

    if(selectedUsers.length < 2){
        alert("Selecciona al menos 2 usuarios");
        return;
    }

    const datos = {
        nombre: nombreGrupo,
        isModerated: isModerated,
        usuarios: selectedUsers.map(u => u.id)
    };

    console.log("Datos para enviar al backend:", datos);

    try {

        const response = await fetch(`/chat/grupo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        if(!response.ok){
            throw new Error("Error al crear el grupo");
        }

        const nuevoGrupo = await response.json();

        chatss.push(nuevoGrupo);
        renderChats();
        openChat(nuevoGrupo);

        cerrarCuadro();

        // Reset
        selectedUsers = [];
        nombreGrupo = "";
        isModerated = false;

    } catch (e) {
        console.error("ERROR:", e);
    }
}

function createGroupChat(){
    const name=document.getElementById("nombreGrupo").value;
    if(name){
        addChat(name + " (Grupo)");
        cerrarCuadro();
    }
}

function renderChats(){
    const container=document.getElementById("chats");
    container.innerHTML="";
    
    chatss.forEach(usuario=>{
        const div=document.createElement("div");
        div.className="chatItem";
        div.textContent=usuario.nombre;

        div.onclick=()=>openChat(usuario);
        container.appendChild(div);
    });
}





//POR AHORA NO SE USA

function searchUsers(){
    const query = document.getElementById("buscarUsuarios").value.toLowerCase();
    const resultsDiv = document.getElementById("usuariosEncontrados");
    resultsDiv.innerHTML="";
    dummyUsers
        .filter(u=>u.toLowerCase().includes(query))
        .forEach(user=>{
            const div=document.createElement("div");
            div.className="userResult";
            div.textContent=user;
            div.onclick=()=>selectUser(user);
            resultsDiv.appendChild(div);
        });
}

function selectUser(user){
    if(!selectedUsers.includes(user)){
        selectedUsers.push(user);
        const span=document.createElement("span");
        span.className="selectedUser";
        span.textContent=user;
        document.getElementById("usuariosElegidos").appendChild(span);
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