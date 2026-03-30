const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
  academia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Academia',
    required: true
  },
  telefone: String,
  fotoPerfil: String,
  ativo: {
    type: Boolean,
    default: true
  },
  online: {
    type: Boolean,
    default: false
  },
  ultimoLogin: Date,
  permissoes: {
    gerenciarUsuarios: { type: Boolean, default: true },
    gerenciarTreinos: { type: Boolean, default: true },
    verAnalytics: { type: Boolean, default: true },
    gerenciarPlanos: { type: Boolean, default: true }
  },
  criadoEm: {
    type: Date,
    default: Date.now
  },
  atualizadoEm: {
    type: Date,
    default: Date.now
  }
});

// Hash da senha antes de salvar
adminSchema.pre('save', async function() {
  if (!this.isModified('senha')) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
  } catch (error) {
    throw error;
  }
});

// Método para comparar senhas
adminSchema.methods.compararSenha = async function(senhaInserida) {
  return await bcrypt.compare(senhaInserida, this.senha);
};

module.exports = mongoose.model('Admin', adminSchema);
