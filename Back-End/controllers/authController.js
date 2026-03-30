const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Usuario = require('../models/Usuario');

const gerarToken = (usuario, isAdmin = false) => {
  return jwt.sign(
    {
      id: usuario._id,
      email: usuario.email,
      academia: usuario.academia,
      isAdmin: isAdmin,
      isUsuario: !isAdmin
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// LOGIN
const loginAdmin = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    const admin = await Admin.findOne({ email }).populate('academia');

    if (!admin || !(await admin.compararSenha(senha))) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    if (!admin.ativo) {
      return res.status(401).json({ erro: 'Conta de administrador inativa' });
    }

    // Atualizar status online e último login
    admin.online = true;
    admin.ultimoLogin = new Date();
    await admin.save();

    const token = gerarToken(admin, true);

    return res.json({
      token,
      admin: {
        id: admin._id,
        nome: admin.nome,
        email: admin.email,
        academia: admin.academia,
        fotoPerfil: admin.fotoPerfil,
        isAdmin: true
      }
    });
  } catch (error) {
    console.error('Erro no login admin:', error);
    return res.status(500).json({ erro: 'Erro ao fazer login' });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    const usuario = await Usuario.findOne({ email }).populate('academia').populate('adminCriador');

    if (!usuario || !(await usuario.compararSenha(senha))) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    if (!usuario.ativo) {
      return res.status(401).json({ erro: 'Conta inativa' });
    }

    // Atualizar status online e último login
    usuario.online = true;
    usuario.ultimoLogin = new Date();
    usuario.ultimaAtividadeEm = new Date();
    await usuario.save();

    const token = gerarToken(usuario, false);

    return res.json({
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        academia: usuario.academia,
        fotoPerfil: usuario.fotoPerfil,
        role: usuario.role,
        medidas: usuario.medidas,
        isAdmin: false,
        isUsuario: true
      }
    });
  } catch (error) {
    console.error('Erro no login usuário:', error);
    return res.status(500).json({ erro: 'Erro ao fazer login' });
  }
};

// LOGOUT
const logout = async (req, res) => {
  try {
    const { id, isAdmin } = req.usuario;

    if (isAdmin) {
      await Admin.findByIdAndUpdate(id, { online: false });
    } else {
      await Usuario.findByIdAndUpdate(id, { online: false });
    }

    return res.json({ mensagem: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro no logout:', error);
    return res.status(500).json({ erro: 'Erro ao fazer logout' });
  }
};

// VERIFICAR SESSÃO
const verificarSessao = async (req, res) => {
  try {
    const { id, isAdmin } = req.usuario;

    if (isAdmin) {
      const admin = await Admin.findById(id).populate('academia');
      return res.json({
        autenticado: true,
        tipo: 'admin',
        admin: {
          id: admin._id,
          nome: admin.nome,
          email: admin.email,
          academia: admin.academia,
          fotoPerfil: admin.fotoPerfil
        }
      });
    } else {
      const usuario = await Usuario.findById(id).populate('academia');
      return res.json({
        autenticado: true,
        tipo: 'usuario',
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
          academia: usuario.academia,
          fotoPerfil: usuario.fotoPerfil,
          role: usuario.role,
          medidas: usuario.medidas
        }
      });
    }
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    return res.status(401).json({ autenticado: false });
  }
};

module.exports = {
  loginAdmin,
  loginUsuario,
  logout,
  verificarSessao,
  gerarToken
};
