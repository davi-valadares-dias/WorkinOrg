# 📖 Instruções em Português

## 🎯 Comece Aqui

Bem-vindo ao **WorkinOrg**! Este guia vai te ajudar a começar o projeto em poucos minutos.

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js** - [Baixar aqui](https://nodejs.org/)
   ```bash
   node --version  # Deve retornar v14+ 
   ```

2. **MongoDB** - Uma das opções:
   - Instalado localmente: [Download](https://www.mongodb.com/try/download/community)
   - MongoDB Atlas (nuvem): [Criar conta gratuita](https://www.mongodb.com/cloud/atlas)
   - Docker: `docker run -d -p 27017:27017 --name mongodb mongo`

---

## 🚀 Setup Rápido (Windows)

### Opção 1: Script Automático (Recomendado)

1. Abra **PowerShell** na pasta do projeto
2. Execute:
   ```bash
   PowerShell -ExecutionPolicy Bypass -File setup.bat
   ```
3. Aguarde a instalação
4. Siga as instruções finais

### Opção 2: Manual

#### Terminal 1 - Backend (Express.js + MongoDB)

```bash
# Ir para pasta do backend
cd Back-End

# Instalar dependências
npm install

# Criar admin padrão (seu primeiro admin!)
npm run seed

# Rodar servidor
npm run dev
```

Você verá:
```
✅ MongoDB conectado com sucesso
Servidor rodando em http://localhost:3000
```

#### Terminal 2 - Frontend (React)

```bash
# Nova aba do terminal - ir para frontend
cd Front-End

# Instalar dependências
npm install

# Rodar aplicação
npm run dev
```

Você verá:
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:5173
```

---

## 🔐 Primeiros Passos

### 1. Abrir a Página

Abra seu navegador (Chrome, Firefox, Edge) e vá para:
```
http://localhost:5173
```

### 2. Fazer Login como Admin

- **Email:** admin@workinorg.com
- **Senha:** admin123

Clique na aba "Administrador" e faça login.

### 3. Criar seu Primeiro Usuário

1. No painel admin, clique em **"➕ Criar Usuário"**
2. Preencha os dados:
   - Nome: João Silva
   - Email: joao@email.com
   - Senha: senha123
   - Idade: 28
   - Sexo: Masculino
   - Peso: 75 kg
   - Altura: 180 cm
3. Clique em **"Criar Usuário"**

### 4. Fazer Login como Usuário

1. Faça logout (botão vermelho no canto)
2. Na página de login, clique em **"Usuário"**
3. Use as credenciais criadas (joao@email.com / senha123)

---

## 📊 Explorando o Painel Admin

### Dashboard
- Veja estatísticas gerais
- Total de usuários: 1
- Usuários online agora: mostra quem está conectado

### Usuários
- Lista todos os usuários
- Clique em **"✏️ Editar"** para atualizar peso/altura
- Modal abrirá para você editar

### Online
- Mostra quem está usando o sistema AGORA
- Atualiza em tempo real

### Criar Usuário
- Formulário para adicionar novo usuário
- Todas as informações de saúde são opcionais

---

## 🏋️ Usando como Usuário

### Criar Treino
1. Clique em **"Montar Treino"**
2. Preencha nome e exercícios
3. Salve seu treino

### Executar Treino
1. Clique em **"Executar Treino"**
2. Selecione o treino
3. Registre suas séries e repetições
4. Deixe comentários sobre sua performance

### Ver Seu Progresso
1. Clique em **"Histórico"**
2. Veja todos os treinos que já fez

---

## 🐛 Possíveis Problemas

### "MongoDB connection failed"
**Solução:**
```bash
# Se usando local:
mongod

# Se usando Docker:
docker run -d -p 27017:27017 --name mongodb mongo

# Se usando Atlas:
# Atualize .env em Back-End/
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@seu_cluster.mongodb.net/workinorg
```

### "Port 3000 already in use"
```bash
# Encontrar processo na porta 3000:
lsof -i :3000

# Encerrar:
kill -9 <PID>
```

### "Cannot find module 'mongoose'"
```bash
cd Back-End
npm install
```

### Frontend não conecta ao backend
- Certifique-se que backend está rodando em `localhost:3000`
- Verifique se não há erro no console (F12)
- Reinicie ambos (Ctrl+C e npm run dev novamente)

---

## 📚 Arquivos Importantes

| Arquivo | O que é |
|---------|--------|
| `README.md` | Documentação completa |
| `QUICKSTART.md` | Início rápido (inglês) |
| `API_DOCS.md` | Como usar a API |
| `ROADMAP.md` | Futuras funcionalidades |
| `ARCHITECTURE.md` | Explicação técnica do projeto |
| `Back-End/.env` | Configurações do backend |
| `Front-End/.env` | Configurações do frontend |

---

## 🔑 Variáveis de Ambiente

### Back-End/.env
```
MONGODB_URI=mongodb://localhost:27017/workinorg
JWT_SECRET=seu_secret_key_super_seguro_aqui_123456789
PORT=3000
NODE_ENV=development
```

### Front-End/.env
```
VITE_API_URL=http://localhost:3000/api
```

---

## 💡 Dicas Úteis

1. **Usar DevTools (F12)** - Veja erros no console
2. **Limpar localStorage** - Se houver problemas de autenticação
3. **Reiniciar servers** - Sempre a primeira opção quando algo não funciona
4. **Verificar logs** - Terminal do backend mostra muitas informações úteis

---

## 🎨 Personalisação

### Mudar Cores

Edite o arquivo de CSS da página que quer mudar. Exemplo:
```
Front-End/src/pages/Admin/styles.css
```

Procure por `#FFC107` (amarelo) e mude para a cor desejada.

### Mudar Nome da Empresa

Edite `Front-End/src/pages/Login/index.jsx` e procure por "WORKORG".

---

## 🚀 Deploy Futuro

Quando quiser colocar em produção:

1. **Backend:** Heroku, AWS, DigitalOcean, ou Railway
2. **Frontend:** Vercel, Netlify, GitHub Pages
3. **Banco de Dados:** MongoDB Atlas (gratuito)

---

## ❓ Perguntas Frequentes

**P: Por que preciso de dois terminais?**
R: Um para o backend (Express rodando na porta 3000) e outro para o frontend (React na porta 5173). Eles precisam rodar simultaneamente.

**P: Posso mudar as portas?**
R: Sim! No `Back-End/index.js` mude a porta, e em `Front-End/.env` atualize a URL.

**P: Meus dados ficarão salvos?**
R: Sim! Está tudo no MongoDB. Enquanto o banco estiver rodando, os dados persistem.

**P: Como adicionar mais usuarios depois?**
R: Apenas o admin pode criar usuários. Faça login como admin e vá para "Criar Usuário".

**P: Posso usar em múltiplas academias?**
R: Sim! Cada admin é responsável por uma academia. Adicione mais admins e cada um gerencia sua academia.

---

## 📞 Suporte

Se tiver dúvidas:
1. Leia o README.md
2. Consulte API_DOCS.md para entender as rotas
3. Verifique ARCHITECTURE.md para entender a estrutura

---

## ✅ Checklist de Setup

- [ ] Node.js instalado
- [ ] MongoDB rodando
- [ ] npm install (backend)
- [ ] npm install (frontend)
- [ ] npm run seed (backend)
- [ ] Backend rodando em localhost:3000
- [ ] Frontend rodando em localhost:5173
- [ ] Login funcionando
- [ ] Conseguiu criar um usuário
- [ ] Conseguiu fazer login como usuário

---

## 🎉 Pronto para Começar!

Parabéns! Seu sistema de academia está pronto para usar. 

**Próximos passos:**
1. Explore o painel admin
2. Crie alguns usuários
3. Teste a criação de treinos
4. Leia a documentação para entender melhor

**Divirta-se desenvolvendo! 🚀**

---

**Desenvolvido com muito ❤️ em 2026**
