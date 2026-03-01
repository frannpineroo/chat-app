const EntityBase = require('./EntityBase');
const TipoMensaje = require("../shared/Enums/TipoMensaje");

class Mensaje extends EntityBase {
  constructor({ id, chatId, emisorId, contenido, TipoMensaje = "text", archivo, fechaEnvio = new Date(),
                archivado = false, leido = false}) 
    {
    
    super({ id });
    this.chatId = chatId;
    this.emisorId = emisorId;
    this.contenido = contenido;
    this.TipoMensaje = TipoMensaje;
    this.archivo = archivo instanceof Buffer ? archivo : null;
    this.fechaEnvio = fechaEnvio;
    this.archivado = archivado;
    this.leido = leido;
  }
}

module.exports = Mensaje;
