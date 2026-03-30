const express = require('express');
const router = express.Router();
const { loginAdmin, loginUsuario, logout, verificarSessao } = require('../controllers/authController');
const { autenticar } = require('../middleware/auth');

// Rotas públicas
router.post('/login-admin', loginAdmin);
router.post('/login-usuario', loginUsuario);

// Rotas autenticadas
router.post('/logout', autenticar, logout);
router.get('/verificar-sessao', autenticar, verificarSessao);

module.exports = router;
