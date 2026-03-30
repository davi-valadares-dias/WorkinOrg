const mongoose = require('mongoose');

const treinoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  descricao: String,
  academia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Academia',
    required: true
  },
  criador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  criadorTipo: {
    type: String,
    enum: ['usuario', 'admin'],
    required: true
  },
  
  // Exercícios
  exercicios: [{
    nome: String,
    musculos: [String],
    series: Number,
    repeticoes: String,
    descanso: String,
    memo: String,
    videoUrl: String,
    ordem: Number,
    completado: Boolean,
    peso: Number
  }],
  
  // Configuração
  tipo: {
    type: String,
    enum: ['forca', 'hipertrofia', 'resistencia', 'cardio', 'flexibilidade', 'misto'],
    default: 'misto'
  },
  duracao: String, // ex: "45 minutos"
  dificuldade: { type: String, enum: ['facil', 'moderado', 'dificil'] },
  
  // Usuários que usam este treino
  usuariosQueUsam: [{
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    },
    dataInicio: Date,
    ativo: { type: Boolean, default: true },
    ultimaExecucao: Date
  }],
  
  // Comentários do Admin
  comentariosAdmin: [{
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    nomeAdmin: String,
    texto: String,
    criadoEm: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Feedback
  tags: [String],
  publico: { type: Boolean, default: false }, // treinos públicos da academia
  ativo: { type: Boolean, default: true },
  
  criadoEm: {
    type: Date,
    default: Date.now
  },
  atualizadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Treino', treinoSchema);
