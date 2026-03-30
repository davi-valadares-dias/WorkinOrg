const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true
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
  adminCriador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  role: {
    type: String,
    enum: ['usuario', 'admin'],
    default: 'usuario'
  },
  
  // Dados Pessoais
  idade: Number,
  sexo: {
    type: String,
    enum: ['M', 'F', 'O']
  },
  
  // Medidas do Corpo
  medidas: {
    peso: {
      valor: Number,
      data: Date,
      historico: [{ valor: Number, data: Date }]
    },
    altura: Number, // em cm
    peito: { valor: Number, data: Date },
    cintura: { valor: Number, data: Date },
    quadril: { valor: Number, data: Date },
    braco: { valor: Number, data: Date },
    perna: { valor: Number, data: Date },
    imc: Number
  },
  
  // Status
  ativo: {
    type: Boolean,
    default: true
  },
  online: {
    type: Boolean,
    default: false
  },
  ultimoLogin: Date,
  ultimaAtividadeEm: Date,
  
  // Plano
  plano: {
    tipo: { type: String, enum: ['basico', 'premium', 'elite'], default: 'basico' },
    dataInicio: Date,
    dataTermino: Date,
    ativo: { type: Boolean, default: true }
  },
  
  // Preferências
  preferencias: {
    notificacoes: { type: Boolean, default: true },
    temaModo: { type: String, enum: ['claro', 'escuro'], default: 'escuro' }
  },
  
  fotoPerfil: String,
  observacoes: String,
  
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
usuarioSchema.pre('save', async function() {
  if (!this.isModified('senha')) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
  } catch (error) {
    throw error;
  }
});

// Método para comparar senhas
usuarioSchema.methods.compararSenha = async function(senhaInserida) {
  return await bcrypt.compare(senhaInserida, this.senha);
};

// Método para calcular IMC
usuarioSchema.methods.calcularIMC = function() {
  if (this.medidas.peso?.valor && this.medidas.altura) {
    const peso = this.medidas.peso.valor;
    const altura = this.medidas.altura / 100;
    this.medidas.imc = (peso / (altura * altura)).toFixed(1);
  }
};

module.exports = mongoose.model('Usuario', usuarioSchema);
