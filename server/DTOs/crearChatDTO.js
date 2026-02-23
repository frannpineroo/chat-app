class crearChatDTO {
    constructor(body) {

        //if (!body.nombreChat || typeof body.nombreChat !== "string") {
        //    throw new Error("El chat debe tener un nombre válido");
        //}

        //if (!body.usuariosIds || !Array.isArray(body.usuariosIds) || body.usuariosIds.length === 0) {
        //    throw new Error("Debe seleccionar al menos un usuario");
        //}

        this.nombreChat = body.nombreChat.trim();
        this.isGroup = body.isGroup ?? false;
        this.isModerated = body.isModerated ?? false;
        this.usuariosIds = body.usuariosIds.map(id => Number(id));
    }
}

module.exports = crearChatDTO;