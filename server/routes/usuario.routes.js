const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.post('/', usuarioController.registrarUsuario);
router.get('/', usuarioController.listarUsuarios);

module.exports = router;