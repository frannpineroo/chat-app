const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const chatController = require('../controllers/chat.controller');

router.post('/privado', verificarToken, chatController.obtenerOCrearChatPrivado);

module.exports = router;