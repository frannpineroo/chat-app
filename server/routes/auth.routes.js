const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', verificarToken, (req, res) => {
    res.json({ id: req.usuario.id, nombre: req.usuario.nombre });
});

module.exports = router;