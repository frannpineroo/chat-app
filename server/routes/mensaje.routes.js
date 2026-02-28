const express = require('express');
const router = express.Router();
const mensajeController = require('../controllers/mensaje.controller');

router.get('/:chatId', mensajeController.listarPorChat);

module.exports = router;