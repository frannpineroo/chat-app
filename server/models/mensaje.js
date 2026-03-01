const EntityBase = require('./EntityBase');
const TipoMensaje = require("../shared/Enums/TipoMensaje");

class Mensaje {
    constructor( info, usuarioId) {
        this.id = info.id;
        this.usuarioId = usuarioId;
    }
}

module.exports = Mensaje;
