const mongoose = require('mongoose');

const historicaTreinoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  treino: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Treino',
    required: true
  },
  academia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Academia',
    required: true
  },
  
  dataExecucao: {
    type: Date,
    default: Date.now
  },
  
  // Detalhes da execução
  exercicios: [{
    nome: String,
    series: [{
      numero: Number,
      repeticoes: Number,
      peso: Number,
      concluida: Boolean
    }]
  }],
  
  duracao: String, // em minutos
  concluidoPercentual: Number,
  comentario: String,
  energia: { type: Number, enum: [1, 2, 3, 4, 5] }, // nota de 1-5
  dor: { type: Number, enum: [1, 2, 3, 4, 5] }, // nota de 1-5
  
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HistoricoTreino', historicaTreinoSchema);
