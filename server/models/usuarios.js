class Usuario {
    constructor( id, nombre, apellido, email, contra, isOnline ) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.contra = contra;
        this.isOnline = isOnline;
    }
}

module.exports = {
    Usuario
}