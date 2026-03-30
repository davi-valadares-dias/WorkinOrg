const Usuario = require('../models/Usuario');
const Treino = require('../models/Treino');
const HistoricoTreino = require('../models/HistoricoTreino');

// CRIAR TREINO (usuário ou admin)
const criarTreino = async (req, res) => {
  try {
    const { nome, descricao, tipo, duracao, dificuldade, exercicios, exercises, publico, paraUsuarioId } = req.body;
    const adminId = req.usuario.id;
    const { isAdmin } = req.usuario;

    // Se paraUsuarioId existe, admin está criando para outro usuário
    if (paraUsuarioId && isAdmin) {
      // Buscar o usuário para o qual o treino será criado
      const usuarioAlvo = await Usuario.findById(paraUsuarioId).populate('academia');
      if (!usuarioAlvo) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      // Buscar admin para pegar academia
      const Admin = require('../models/Admin');
      const admin = await Admin.findById(adminId).populate('academia');
      if (!admin) {
        return res.status(404).json({ erro: 'Admin não encontrado' });
      }

      // Verificar se o usuário pertence à academia do admin
      const usuarioAcademiaId = usuarioAlvo.academia._id ? usuarioAlvo.academia._id.toString() : usuarioAlvo.academia.toString();
      const adminAcademiaId = admin.academia._id.toString();
      
      if (usuarioAcademiaId !== adminAcademiaId) {
        return res.status(403).json({ erro: 'Usuário não pertence à sua academia' });
      }

      // Converter exercises para exercicios se necessário
      const exerciciosFormatados = (exercises || exercicios || []).map(ex => 
        typeof ex === 'string' ? { nome: ex } : ex
      );

      // Criar treino para o usuário
      const novoTreino = new Treino({
        nome,
        descricao,
        academia: admin.academia._id,
        criador: paraUsuarioId, // Criador é o usuário, não o admin
        criadorTipo: 'usuario',
        tipo,
        duracao,
        dificuldade,
        exercicios: exerciciosFormatados,
        publico: publico || false,
        ativo: true
      });

      await novoTreino.save();

      // Adicionar na lista de treinos que o usuário usa
      novoTreino.usuariosQueUsam.push({
        usuario: paraUsuarioId,
        dataInicio: new Date(),
        ativo: true
      });
      await novoTreino.save();

      return res.status(201).json({
        mensagem: `Treino criado para o usuário`,
        treino: novoTreino
      });
    }

    // Comportamento original - criação por si mesmo
    let usuario = await Usuario.findById(adminId).populate('academia');
    let criadorTipo = 'usuario';
    let academiaId = null;

    if (!usuario) {
      // Se não for usuário, procura admin
      const Admin = require('../models/Admin');
      const admin = await Admin.findById(adminId).populate('academia');
      if (!admin) {
        return res.status(404).json({ erro: 'Usuário/Admin não encontrado' });
      }
      academiaId = admin.academia._id;
      criadorTipo = 'admin';
    } else {
      academiaId = usuario.academia._id;
    }

    // Converter exercises para exercicios se necessário
    const exerciciosFormatados = (exercicios || exercises || []).map(ex => 
      typeof ex === 'string' ? { nome: ex } : ex
    );

    // Criar novo treino
    const novoTreino = new Treino({
      nome,
      descricao,
      academia: academiaId,
      criador: adminId,
      criadorTipo,
      tipo,
      duracao,
      dificuldade,
      exercicios: exerciciosFormatados,
      publico: publico || false,
      ativo: true
    });

    await novoTreino.save();

    // Se usuário criador, adicionar na lista de treinos que usa
    if (!isAdmin && usuario) {
      novoTreino.usuariosQueUsam.push({
        usuario: adminId,
        dataInicio: new Date(),
        ativo: true
      });
      await novoTreino.save();
    }

    return res.status(201).json({
      mensagem: 'Treino criado com sucesso',
      treino: novoTreino
    });
  } catch (error) {
    console.error('Erro ao criar treino:', error);
    return res.status(500).json({ erro: 'Erro ao criar treino' });
  }
};

// LISTAR TREINOS DO USUÁRIO
const listarTreinosUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const usuario = await Usuario.findById(usuarioId).populate('academia');
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    // Buscar treinos que o usuário usa
    const treinos = await Treino.find({
      academia: usuario.academia._id,
      'usuariosQueUsam.usuario': usuarioId,
      ativo: true
    }).populate('criador', 'nome').populate('comentariosAdmin.admin', 'nome');

    return res.json({
      total: treinos.length,
      treinos
    });
  } catch (error) {
    console.error('Erro ao listar treinos:', error);
    return res.status(500).json({ erro: 'Erro ao listar treinos' });
  }
};

// LISTAR TODOS OS TREINOS PÚBLICOS DA ACADEMIA
const listarTreinosPublicos = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const usuario = await Usuario.findById(usuarioId).populate('academia');
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const treinos = await Treino.find({
      academia: usuario.academia._id,
      publico: true,
      ativo: true
    }).populate('criador', 'nome').populate('comentariosAdmin.admin', 'nome');

    return res.json({
      total: treinos.length,
      treinos
    });
  } catch (error) {
    console.error('Erro ao listar treinos públicos:', error);
    return res.status(500).json({ erro: 'Erro ao listar treinos públicos' });
  }
};

// ADICIONAR TREINO PARA O USUÁRIO (começar a usar)
const adicionarTreinoParaUsuario = async (req, res) => {
  try {
    const { treinoId } = req.params;
    const usuarioId = req.usuario.id;

    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const treino = await Treino.findById(treinoId);
    if (!treino) {
      return res.status(404).json({ erro: 'Treino não encontrado' });
    }

    // Verificar se já está usando
    const jaEstaUsando = treino.usuariosQueUsam.some(u => u.usuario.toString() === usuarioId);
    if (jaEstaUsando) {
      return res.status(400).json({ erro: 'Você já está usando este treino' });
    }

    treino.usuariosQueUsam.push({
      usuario: usuarioId,
      dataInicio: new Date(),
      ativo: true
    });

    await treino.save();

    return res.json({
      mensagem: 'Treino adicionado com sucesso',
      treino
    });
  } catch (error) {
    console.error('Erro ao adicionar treino:', error);
    return res.status(500).json({ erro: 'Erro ao adicionar treino' });
  }
};

// REMOVER TREINO DO USUÁRIO
const removerTreinoDoUsuario = async (req, res) => {
  try {
    const { treinoId } = req.params;
    const usuarioId = req.usuario.id;

    const treino = await Treino.findById(treinoId);
    if (!treino) {
      return res.status(404).json({ erro: 'Treino não encontrado' });
    }

    treino.usuariosQueUsam = treino.usuariosQueUsam.filter(
      u => u.usuario.toString() !== usuarioId
    );

    await treino.save();

    return res.json({
      mensagem: 'Treino removido com sucesso',
      treino
    });
  } catch (error) {
    console.error('Erro ao remover treino:', error);
    return res.status(500).json({ erro: 'Erro ao remover treino' });
  }
};

// REGISTRAR EXECUÇÃO DE TREINO
const registrarExecucaoTreino = async (req, res) => {
  try {
    const { treinoId } = req.params;
    const { exercicios, duracao, concluidoPercentual, comentario, energia, dor } = req.body;
    const usuarioId = req.usuario.id;

    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const treino = await Treino.findById(treinoId);
    if (!treino) {
      return res.status(404).json({ erro: 'Treino não encontrado' });
    }

    // Registrar no histórico
    const historico = new HistoricoTreino({
      usuario: usuarioId,
      treino: treinoId,
      academia: usuario.academia,
      exercicios,
      duracao,
      concluidoPercentual,
      comentario,
      energia,
      dor,
      dataExecucao: new Date()
    });

    await historico.save();

    // Atualizar última execução
    const indexUsuario = treino.usuariosQueUsam.findIndex(u => u.usuario.toString() === usuarioId);
    if (indexUsuario !== -1) {
      treino.usuariosQueUsam[indexUsuario].ultimaExecucao = new Date();
      await treino.save();
    }

    // Atualizar última atividade do usuário
    usuario.ultimaAtividadeEm = new Date();
    await usuario.save();

    return res.status(201).json({
      mensagem: 'Treino registrado com sucesso',
      historico
    });
  } catch (error) {
    console.error('Erro ao registrar execução:', error);
    return res.status(500).json({ erro: 'Erro ao registrar execução' });
  }
};

// ATUALIZAR TREINO
const atualizarTreino = async (req, res) => {
  try {
    const { treinoId } = req.params;
    const { nome, descricao, tipo, duracao, dificuldade, exercicios, publico } = req.body;
    const usuarioId = req.usuario.id;

    const treino = await Treino.findById(treinoId);
    if (!treino) {
      return res.status(404).json({ erro: 'Treino não encontrado' });
    }

    // Verificar se é criador ou admin da academia
    if (treino.criador.toString() !== usuarioId && !req.usuario.isAdmin) {
      return res.status(403).json({ erro: 'Você não tem permissão para editar este treino' });
    }

    if (nome) treino.nome = nome;
    if (descricao) treino.descricao = descricao;
    if (tipo) treino.tipo = tipo;
    if (duracao) treino.duracao = duracao;
    if (dificuldade) treino.dificuldade = dificuldade;
    if (exercicios) treino.exercicios = exercicios;
    if (publico !== undefined) treino.publico = publico;

    treino.atualizadoEm = new Date();
    await treino.save();

    return res.json({
      mensagem: 'Treino atualizado com sucesso',
      treino
    });
  } catch (error) {
    console.error('Erro ao atualizar treino:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar treino' });
  }
};

// DELETAR TREINO
const deletarTreino = async (req, res) => {
  try {
    const { treinoId } = req.params;
    const usuarioId = req.usuario.id;

    const treino = await Treino.findById(treinoId);
    if (!treino) {
      return res.status(404).json({ erro: 'Treino não encontrado' });
    }

    if (treino.criador.toString() !== usuarioId && !req.usuario.isAdmin) {
      return res.status(403).json({ erro: 'Você não tem permissão para deletar este treino' });
    }

    treino.ativo = false;
    await treino.save();

    return res.json({
      mensagem: 'Treino deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar treino:', error);
    return res.status(500).json({ erro: 'Erro ao deletar treino' });
  }
};

// OBTER HISTÓRICO DO USUÁRIO
const obterHistoricoUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { limite = 10, pagina = 1 } = req.query;

    const skip = (pagina - 1) * limite;

    const historico = await HistoricoTreino.find({ usuario: usuarioId })
      .populate('treino', 'nome tipo')
      .sort({ dataExecucao: -1 })
      .limit(parseInt(limite))
      .skip(skip);

    const total = await HistoricoTreino.countDocuments({ usuario: usuarioId });

    return res.json({
      total,
      pagina: parseInt(pagina),
      limite: parseInt(limite),
      historico
    });
  } catch (error) {
    console.error('Erro ao obter histórico:', error);
    return res.status(500).json({ erro: 'Erro ao obter histórico' });
  }
};

module.exports = {
  criarTreino,
  listarTreinosUsuario,
  listarTreinosPublicos,
  adicionarTreinoParaUsuario,
  removerTreinoDoUsuario,
  registrarExecucaoTreino,
  atualizarTreino,
  deletarTreino,
  obterHistoricoUsuario
};
