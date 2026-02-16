const EntityBase = require("./EntityBase");

class Usuario extends EntityBase {
    constructor( id, nombre, apellido, email, contra, enLinea = false, activo = true, fechaCreacion = new Date()) {
        super(id);
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.contra = contra;
        this.enLinea = enLinea;
        this.activo = activo;
        this.fechaCreacion = fechaCreacion;
    }
}

module.exports = {
    Usuario
}