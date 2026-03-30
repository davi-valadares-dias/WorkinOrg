# 🚀 QUICKSTART - Começando em 5 minutos

## ⚡ Setup Rápido (Windows)

1. Abra PowerShell na pasta do projeto
2. Execute: `.\setup.bat`
3. Aguarde a instalação...
4. Siga as instruções finais

---

## 🎯 Setup Manual (Linux/Mac ou se o script não funcionar)

### Terminal 1 - Backend

```bash
cd Back-End
npm install
npm run seed    # Criar admin padrão
npm run dev     # Rodar servidor
```

### Terminal 2 - Frontend

```bash
cd Front-End
npm install
npm run dev
```

---

## 📱 Acessar a Aplicação

1. **Frontend:** http://localhost:5173
2. **Backend:** http://localhost:3000

---

## 🔑 Credenciais Padrão

- **Email:** admin@workinorg.com
- **Senha:** admin123

---

## 📋 Checklist de Requisitos

- ✅ Node.js instalado (`node --version`)
- ✅ MongoDB rodando (local ou Atlas)
- ✅ Portas 3000 e 5173 disponíveis

---

## 🐛 Erros Comuns

**"Cannot find module 'mongoose'"**
```bash
cd Back-End && npm install
```

**"MongoDB connection failed"**
- Inicie MongoDB: `mongod` (Windows/Linux) ou Docker
- Ou use MongoDB Atlas e atualize `.env`

**"Port 3000 already in use"**
```bash
lsof -i :3000  # Ver processo
kill -9 <PID>  # Encerrar
```

**"CORS Error"**
- Certifique-se que backend está em `localhost:3000`
- Frontend em `localhost:5173`

---

## 📚 Estrutura Base

```
WorkinOrg/
├── Back-End/     (Express + MongoDB)
├── Front-End/    (React + Vite)
└── README.md     (Documentação completa)
```

---

## 🎨 Primeiros Passos no Admin

1. Login com admin@workinorg.com / admin123
2. Vá para "Criar Usuário"
3. Crie seu primeiro usuário
4. Faça login com esse usuário
5. Crie seu primeiro treino!

---

## 🔗 URLs Úteis

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api
- **MongoDB Local:** mongodb://localhost:27017
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas

---

## 💡 Próximo Passo

Leia o `README.md` para documentação completa!
