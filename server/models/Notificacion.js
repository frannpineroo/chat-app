const EntityBase = require('./EntityBase');

class Notificacion extends EntityBase {
  constructor({id,usuarioId, mensaje, fechaCreacion = new Date(), pendiente = true}) 
  {
    super({ id });
    this.usuarioId = usuarioId;
    this.mensaje = mensaje;
    this.fechaCreacion = fechaCreacion;
    this.pendiente = pendiente;
  }
}

module.exports = Notificacion;
