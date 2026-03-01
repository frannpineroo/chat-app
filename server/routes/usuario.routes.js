const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.post('/', usuarioController.registrarUsuario);
router.get('/', usuarioController.listarUsuarios);
router.get("/:nombre", usuarioController.buscarPorNombre);
router.get('/', usuarioController.buscarUsuarios);
router.put('/:id', usuarioController.cambiarEstado);

module.exports = router;