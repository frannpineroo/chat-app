const EntityBase = require("./EntityBase")

class Chat extends EntityBase{
    constructor( id, nombre, isPrivate = false, esModerado = false, fechaCreacion, fechaActualizacion) 
    {
        super(id);
        this.nombre = nombre;
        this.isPrivate = isPrivate;
        this.esModerado = esModerado;
        this.fechaCreacion = fechaCreacion || new Date();
        this.fechaActualizacion = fechaActualizacion || new Date();
    }
}

module.exports = Chat;

