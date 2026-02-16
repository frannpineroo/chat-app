const EntityBase = require("./EntityBase")

class Chat extends EntityBase{
    constructor( id, nombre, esGrupo = false, esModerado = false, fechaCreacion = new Date(), fechaActualizacion = new Date() ) 
    {
        super(id);
        this.nombre = nombre;
        this.esGrupo = esGrupo;
        this.esModerado = esModerado;
        this.fechaCreacion = fechaCreacion;
        this.fechaActualizacion = fechaActualizacion;
    }
}

module.exports = Chat;

