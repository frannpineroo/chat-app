const express = require('express');
const router = express.Router();
const mensajeController = require('../controllers/mensaje.controller');

router.get('/:chatId',( req, res, next) => {
    console.log('Llego a /api/mensajes/', req.params.chatId);
}, mensajeController.listarPorChat);

module.exports = router;