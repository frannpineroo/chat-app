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

const listarUsuarios = async ( req, res ) => {
    try {
        const usuarios = await usuarioServicio.listarUsuarios();

        res.json(usuarios);
    } catch ( error ) {
        console.error(error.message);

        res.status(500).json({
            error: error.message
        });
    }
}

const buscarPorNombre = async ( req, res ) => {
    try {
        const nombre = req.params.nombre;
        const usuarios = await usuarioRepo.buscarUsuarioPorNombre(nombre);

        if (!usuarios || usuarios.length === 0)
            return res.json({ message: "No hay usuarios con ese nombre" });

        const dto = usuarios.map(usuario => new verUsuarioDTO(usuario));
        res.json(dto);
    } catch (error) {
        res.json({ message: "Error al buscar usuarios"});
    }
};

const buscarUsuarios = async ( req, res ) => {
    try {
        const usuarios = await usuarioRepo.obtenerUsuarios();

        if (!usuarios || usuarios.length === 0)
            return res.json([]);
        const dto = usuarios.map(usuario => new verUsuarioDTO(usuario));
        res.json(dto);
    } catch (error) {
        res.json({ message: "Error al buscar usuarios"});
    }
};

const cambiarEstado = async ( req, res ) => {
    try {
        const id = req.params.id;
        const usuario = await usuarioRepo.obtenerUsuarioPorId(id);

        if (!usuario)
            return res.json({ message: "Usuario no encontrado" });
        if (usuario.IsActive == true){
             usuario.IsActive = false;
        } else {
            usuario.IsActive = true;
        }
        await usuarioRepo.actualizarUsuario(id, usuario);

        res.json(usuario);
    } catch (error) {
        res.json({ message: "Error al buscar usuarios"});
    }
};
module.exports = {
    registrarUsuario,
    listarUsuarios, buscarPorNombre, buscarUsuarios, cambiarEstado
}