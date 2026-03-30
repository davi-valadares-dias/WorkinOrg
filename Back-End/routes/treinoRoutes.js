const express = require('express');
const router = express.Router();
const { autenticar, verificarUsuario } = require('../middleware/auth');
const {
  criarTreino,
  listarTreinosUsuario,
  listarTreinosPublicos,
  adicionarTreinoParaUsuario,
  removerTreinoDoUsuario,
  registrarExecucaoTreino,
  atualizarTreino,
  deletarTreino,
  obterHistoricoUsuario
} = require('../controllers/treinoController');

// Todas as rotas requerem autenticação
router.use(autenticar);

// Treinos do usuário
router.post('/criar', criarTreino);
router.get('/meus-treinos', listarTreinosUsuario);
router.get('/treinos-publicos', listarTreinosPublicos);
router.post('/:treinoId/adicionar', adicionarTreinoParaUsuario);
router.delete('/:treinoId/remover', removerTreinoDoUsuario);
router.put('/:treinoId/atualizar', atualizarTreino);
router.delete('/:treinoId/deletar', deletarTreino);

// Execução e histórico
router.post('/:treinoId/executar', registrarExecucaoTreino);
router.get('/historico', obterHistoricoUsuario);

module.exports = router;
