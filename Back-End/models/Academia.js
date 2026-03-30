const mongoose = require('mongoose');

const academiaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  cnpj: String,
  telefone: String,
  endereco: String,
  cidade: String,
  estado: String,
  cep: String,
  descricao: String,
  imagemUrl: String,
  ativa: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('Academia', academiaSchema);
