require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Notas: Você precisa ter MongoDB instalado localmente ou usar MongoDB Atlas
// Se usar MongoDB Atlas, troque MONGODB_URI no .env para sua connection string
// mongodb+srv://usuario:senha@cluster.mongodb.net/workinorg

// CONFIGURAR BANCO DE DADOS
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado com sucesso'))
  .catch(err => {
    console.error('❌ Erro ao conectar MongoDB:', err.message);
    console.log('Certifique-se de que o MongoDB está rodando localmente');
    console.log('Ou configure a variável MONGODB_URI no .env com sua URL do MongoDB Atlas');
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rotas
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const treinoRoutes = require('./routes/treinoRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/treinos', treinoRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    mensagem: '🏋️ WorkinOrg API - Sistema de Academia',
    status: 'Online',
    versao: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      treinos: '/api/treinos'
    }
  });
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Tratamento geral de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    erro: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`
╔════════════════════════════════════╗
║   🏋️  WorkinOrg API                ║
║   Rodando em http://localhost:${port}   ║
║   Ambiente: ${process.env.NODE_ENV || 'development'}      ║
╚════════════════════════════════════╝
  `);
});