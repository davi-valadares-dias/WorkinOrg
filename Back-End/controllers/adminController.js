const Usuario = require('../models/Usuario');
const Admin = require('../models/Admin');
const Treino = require('../models/Treino');
const Academia = require('../models/Academia');

// CRIAR NOVO USUÁRIO
const criarUsuario = async (req, res) => {
  try {
    const adminId = req.usuario.id;
    const { nome, email, senha, idade, sexo, peso, altura } = req.body;

    // Verificar admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ erro: 'Admin não encontrado' });
    }

    // Verificar se email já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    // Criar novo usuário
    const novoUsuario = new Usuario({
      nome,
      email,
      senha,
      academia: admin.academia,
      adminCriador: adminId,
      role: 'usuario',
      idade,
      sexo,
      medidas: {
        peso: { valor: parseFloat(peso) || 0, data: new Date() },
        altura: parseInt(altura) || 0
      }
    });

    // Calcular IMC
    novoUsuario.calcularIMC();
    await novoUsuario.save();

    return res.status(201).json({
      mensagem: 'Usuário criado com sucesso',
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        role: novoUsuario.role,
        medidas: novoUsuario.medidas
      }
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ erro: 'Erro ao criar usuário' });
  }
};

// LISTAR USUÁRIOS DA ACADEMIA
const listarUsuarios = async (req, res) => {
  try {
    const adminId = req.usuario.id;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ erro: 'Admin não encontrado' });
    }

    // Buscar todos os usuários da academia
    const usuarios = await Usuario.find({ academia: admin.academia }).select('-senha').populate('adminCriador', 'nome email');

    return res.json({
      total: usuarios.length,
      usuarios
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ erro: 'Erro ao listar usuários' });
  }
};

// ATUALIZAR DADOS DO USUÁRIO
const atualizarUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { nome, idade, sexo, peso, altura, observacoes } = req.body;
    const adminId = req.usuario.id;

    // Verificar se admin existe
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ erro: 'Admin não encontrado' });
    }

    // Buscar usuário
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    // Verificar se o usuário pertence à mesma academia
    if (usuario.academia.toString() !== admin.academia.toString()) {
      return res.status(403).json({ erro: 'Usuário não pertence à sua academia' });
    }

    // Atualizar dados
    if (nome) usuario.nome = nome;
    if (idade) usuario.idade = idade;
    if (sexo) usuario.sexo = sexo;
    
    if (peso || altura) {
      if (peso) {
        usuario.medidas.peso = {
          valor: parseFloat(peso),
          data: new Date(),
          historico: [...(usuario.medidas.peso?.historico || []), 
            { valor: usuario.medidas.peso?.valor, data: usuario.medidas.peso?.data }]
        };
      }
      if (altura) usuario.medidas.altura = parseInt(altura);
      usuario.calcularIMC();
    }
    
    if (observacoes) usuario.observacoes = observacoes;

    usuario.atualizadoEm = new Date();
    await usuario.save();

    return res.json({
      mensagem: 'Usuário atualizado com sucesso',
      usuario
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar usuário' });
  }
};

// LISTAR USUÁRIOS ONLINE
const usuariosOnline = async (req, res) => {
  try {
    const adminId = req.usuario.id;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ erro: 'Admin não encontrado' });
    }

    const usuariosOnline = await Usuario.find({
      academia: admin.academia,
      online: true
    }).select('nome email fotoPerfil ultimaAtividadeEm');

    const adminsOnline = await Admin.find({
      academia: admin.academia,
      online: true
    }).select('nome email fotoPerfil ultimoLogin');

    return res.json({
      usuariosOnline: usuariosOnline,
      adminsOnline: adminsOnline,
      totalOnline: usuariosOnline.length + adminsOnline.length
    });
  } catch (error) {
    console.error('Erro ao listar usuários online:', error);
    return res.status(500).json({ erro: 'Erro ao listar usuários online' });
  }
};

// DESATIVAR/ATIVAR USUÁRIO
const alterarStatusUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { ativo } = req.body;
    const adminId = req.usuario.id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ erro: 'Admin não encontrado' });
    }

    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    if (usuario.academia.toString() !== admin.academia.toString()) {
      return res.status(403).json({ erro: 'Usuário não pertence à sua academia' });
    }

    usuario.ativo = ativo;
    usuario.online = false; // Desconectar se desativar
    await usuario.save();

    return res.json({
      mensagem: `Usuário ${ativo ? 'ativado' : 'desativado'} com sucesso`,
      usuario
    });
  } catch (error) {
    console.error('Erro ao alterar status:', error);
    return res.status(500).json({ erro: 'Erro ao alterar status' });
  }
};

// ADICIONAR COMENTÁRIO EM TREINO
const adicionarComentarioTreino = async (req, res) => {
  try {
    const { treinoId } = req.params;
    const { texto } = req.body;
    const adminId = req.usuario.id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ erro: 'Admin não encontrado' });
    }

    const treino = await Treino.findById(treinoId);
    if (!treino) {
      return res.status(404).json({ erro: 'Treino não encontrado' });
    }

    if (treino.academia.toString() !== admin.academia.toString()) {
      return res.status(403).json({ erro: 'Treino não pertence à sua academia' });
    }

    const comentario = {
      admin: adminId,
      nomeAdmin: admin.nome,
      texto,
      criadoEm: new Date()
    };

    treino.comentariosAdmin.push(comentario);
    await treino.save();

    return res.json({
      mensagem: 'Comentário adicionado com sucesso',
      treino
    });
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    return res.status(500).json({ erro: 'Erro ao adicionar comentário' });
  }
};

// VER PROGRESSO DO USUÁRIO
const verProgressoUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const adminId = req.usuario.id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ erro: 'Admin não encontrado' });
    }

    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    if (usuario.academia.toString() !== admin.academia.toString()) {
      return res.status(403).json({ erro: 'Usuário não pertence à sua academia' });
    }

    return res.json({
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        medidas: usuario.medidas,
        plano: usuario.plano,
        ultimoLogin: usuario.ultimoLogin,
        ultimaAtividadeEm: usuario.ultimaAtividadeEm,
        criadoEm: usuario.criadoEm
      }
    });
  } catch (error) {
    console.error('Erro ao ver progresso:', error);
    return res.status(500).json({ erro: 'Erro ao ver progresso' });
  }
};

// OBTER SENHA DO USUÁRIO (protegido)
const obterSenhaUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const adminId = req.usuario.id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ erro: 'Admin não encontrado' });
    }

    const usuario = await Usuario.findById(usuarioId).select('+senha');
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    if (usuario.academia.toString() !== admin.academia.toString()) {
      return res.status(403).json({ erro: 'Usuário não pertence à sua academia' });
    }

    return res.json({
      senha: usuario.senha
    });
  } catch (error) {
    console.error('Erro ao obter senha:', error);
    return res.status(500).json({ erro: 'Erro ao obter senha' });
  }
};

// ATUALIZAR SENHA DO USUÁRIO
const atualizarSenhaUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { novaSenha } = req.body;
    const adminId = req.usuario.id;

    if (!novaSenha || novaSenha.trim().length < 4) {
      return res.status(400).json({ erro: 'Nova senha deve ter pelo menos 4 caracteres' });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ erro: 'Admin não encontrado' });
    }

    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    if (usuario.academia.toString() !== admin.academia.toString()) {
      return res.status(403).json({ erro: 'Usuário não pertence à sua academia' });
    }

    // Atualizar senha (será hashada pelo pre-save hook)
    usuario.senha = novaSenha;
    await usuario.save();

    return res.json({
      mensagem: 'Senha atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar senha' });
  }
};

module.exports = {
  criarUsuario,
  listarUsuarios,
  atualizarUsuario,
  usuariosOnline,
  alterarStatusUsuario,
  adicionarComentarioTreino,
  verProgressoUsuario,
  obterSenhaUsuario,
  atualizarSenhaUsuario
};
