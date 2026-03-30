const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        erro: 'Token não fornecido',
        autenticado: false 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      erro: 'Token inválido',
      autenticado: false 
    });
  }
};

const verificarAdmin = (req, res, next) => {
  if (!req.usuario.isAdmin) {
    return res.status(403).json({ 
      erro: 'Acesso negado. Apenas administradores.',
      message: 'Você não tem permissão para acessar este recurso.'
    });
  }
  next();
};

const verificarUsuario = (req, res, next) => {
  if (!req.usuario.isUsuario && !req.usuario.isAdmin) {
    return res.status(403).json({ 
      erro: 'Acesso negado.',
      message: 'Você não tem permissão para acessar este recurso.'
    });
  }
  next();
};

module.exports = {
  autenticar,
  verificarAdmin,
  verificarUsuario
};
