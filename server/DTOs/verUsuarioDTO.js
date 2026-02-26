class verUsuarioDTO {
    constructor(usuario) {
        this.id = usuario.id;
        this.nombre = usuario.nombre;
        this.apellido = usuario.apellido;
        this.email = usuario.email;

    }
}

module.exports = verUsuarioDTO;