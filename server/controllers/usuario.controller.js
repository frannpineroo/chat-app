const usuarioServicio = require('../services/usuario.servicio');
const {UsuarioRepositorio} = require('../repositories/usuario.repositorio');
const verUsuarioDTO = require('../DTOs/verUsuarioDTO');

const express = require ("express");
const router = express.Router();
const usuarioRepo = new UsuarioRepositorio();

const registrarUsuario = async ( req, res ) => {
    try {
        const { nombre, apellido, email, contra } = req.body;

        const nuevoUsuario = await usuarioServicio.registrarUsuario({
            nombre,
            apellido,
            email,
            contra
        });

        res.status(201).json(nuevoUsuario);
    } catch ( error ) {
        console.error(error.message);

        res.status(400).json({
            error: error.message
        });
    }
};

router.get("/:nombre", async (req, res) => {
    try {
        const nombre = req.params.nombre;
        const usuarios = await usuarioRepo.buscarUsuarioPorNombre(nombre);

        if (!usuarios || usuarios.length === 0)
            return res.json({ message: "No hay usuarios con ese nombre" });

        const dto = usuarios.map(usuario => new verUsuarioDTO(usuario));
        res.json(dto);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar usuarios"});
    }
});

module.exports = {
    registrarUsuario, router
}