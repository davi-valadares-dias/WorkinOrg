const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('A API está online! Acesse /api/teste para ver os dados.');
});

app.get('/api/teste', (req, res) => {
  res.json({
    mensagem: "Olá do Back-end!",
    status: "Sucesso",
    data_criacao: new Date()
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});