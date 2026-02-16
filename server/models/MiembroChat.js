const EntityBase = require('./EntityBase');

class MiembroChat extends EntityBase {
  constructor({id, chatId, usuarioId, esModerador = false, poderEscribir = true, fechaIngreso = new Date() }) 
  {
    super({ id });
    this.chatId = chatId;
    this.usuarioId = usuarioId;
    this.esModerador = esModerador;
    this.poderEscribir = poderEscribir;
    this.fechaIngreso = fechaIngreso;
  }
}

module.exports = MiembroChat;
