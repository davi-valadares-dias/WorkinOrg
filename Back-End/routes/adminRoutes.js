const express = require('express');
const router = express.Router();
const { autenticar, verificarAdmin } = require('../middleware/auth');
const {
  criarUsuario,
  listarUsuarios,
  atualizarUsuario,
  usuariosOnline,
  alterarStatusUsuario,
  adicionarComentarioTreino,
  verProgressoUsuario,
  obterSenhaUsuario,
  atualizarSenhaUsuario
} = require('../controllers/adminController');

// Todas as rotas de admin requerem autenticação e role de admin
router.use(autenticar, verificarAdmin);

// Gerenciamento de usuários
router.post('/usuarios/criar', criarUsuario);
router.get('/usuarios', listarUsuarios);
router.put('/usuarios/:usuarioId', atualizarUsuario);
router.patch('/usuarios/:usuarioId/status', alterarStatusUsuario);
router.get('/usuarios/:usuarioId/progresso', verProgressoUsuario);
router.get('/usuarios/:usuarioId/senha', obterSenhaUsuario);
router.post('/usuarios/:usuarioId/atualizar-senha', atualizarSenhaUsuario);

// Status online
router.get('/usuarios-online', usuariosOnline);

// Comentários em treinos
router.post('/treinos/:treinoId/comentarios', adicionarComentarioTreino);

module.exports = router;
