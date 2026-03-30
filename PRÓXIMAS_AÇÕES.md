# 🎯 Próximas Ações Recomendadas

## ⚡ Importante: Leia Antes!

Este arquivo lista as ações que você DEVE fazer agora para que o sistema funcione perfeitamente.

---

## 📋 Checklist de Ação Imediata

### ✅ Fase 1: Verificação (5 minutos)

- [ ] Verifique se Node.js está instalado: `node --version`
- [ ] Verifique se MongoDB está rodando: `mongo --version`
- [ ] Leia o arquivo `QUICKSTART.md`
- [ ] Leia o arquivo `INSTRUÇÕES_PT.md` (em português)

### ✅ Fase 2: Setup (15 minutos)

**Windows (Recomendado):**
- [ ] Execute: `.\setup.bat`
- [ ] Aguarde análise completa
- [ ] Se houver erro, siga as instruções do erro

**Outro Sistema Operacional:**
- [ ] Abra seu Terminal/PowerShell
- [ ] Siga as instruções do `QUICKSTART.md`

### ✅ Fase 3: Teste (10 minutos)

- [ ] Backend rodando em `localhost:3000`
- [ ] Frontend rodando em `localhost:5173`
- [ ] Faça login:
  - Email: `admin@workinorg.com`
  - Senha: `admin123`
- [ ] Crie um novo usuário
- [ ] Faça login como esse usuário
- [ ] Crie um treino de teste

---

## 🔍 Verificação de Funcionamento

### Backend Funcionando?
```bash
curl http://localhost:3000
# Deve retornar JSON com "WorkinOrg API"
```

### Frontend Funcionando?
- Abra http://localhost:5173 no navegador
- Deveria ver a página de login

### MongoDB Funcionando?
```bash
mongo --eval "db.version()"
# Deve retornar a versão do MongoDB
```

---

## 🛠️ Configurações Opcionais

### 1. Usar MongoDB Atlas (Recomendado para Produção)

1. Vá para [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie uma conta gratuita
3. Crie um cluster
4. Pegue a connection string
5. Atualize `Back-End/.env`:
   ```
   MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@seu_cluster.mongodb.net/workinorg
   ```
6. Reinicie o backend

### 2. Customizar Variáveis JWT

Edite `Back-End/.env`:
```
JWT_SECRET=seu_secret_super_seguro_e_aleatorio_aqui
```

### 3. Mudar Portas

**Backend:**
- Edite `Back-End/index.js`, procure por `const port`

**Frontend:**
- Edite `Front-End/vite.config.js`, procure por `server.port`

### 4. Adicionar HTTPS (Para Produção)

Procure por tutorial de SSL certificates (Let's Encrypt é gratuito).

---

## 📝 Primeiro Uso - Passo a Passo

### Cenário: Administrador de Academia

1. **Login como Admin**
   ```
   Email: admin@workinorg.com
   Senha: admin123
   ```

2. **Ver Dashboard**
   - Vá para a aba "Dashboard"
   - Veja estatísticas básicas

3. **Criar Primeiro Usuário**
   - Vá para "Criar Usuário"
   - Preencha dados (nome, email, senha, peso, altura)
   - Clique "Criar Usuário"

4. **Ver Usuários Online**
   - Clique na aba "Online"
   - Será atualizado quando usuários entrarem

5. **Editar Usuário**
   - Vá para "Usuários"
   - Clique em "✏️ Editar" ao lado do usuário
   - Modal abrirá para editar peso/altura
   - Salve as mudanças

### Cenário: Usuário da Academia

1. **Login como Usuário**
   ```
   Email: do_usuario@example.com
   Senha: que_foi_criada_pelo_admin
   ```

2. **Montar Treino**
   - Clique em "Montar Treino"
   - Defina nome e exercícios
   - Salve o treino

3. **Executar Treino**
   - Clique em "Executar Treino"
   - Selecione o treino
   - Registre séries e repetições
   - Avalie sua energia e dor

4. **Ver Histórico**
   - Clique em "Histórico"
   - Veja todos os treinos realizados

---

## 🚨 Erros Comuns na Primeira Execução

### Erro: "Cannot find module 'mongoose'"
```bash
cd Back-End
npm install
```

### Erro: "MongoDB connection refused"
```bash
# Opção 1: iniciar MongoDB local
mongod

# Opção 2: usar Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Opção 3: usar MongoDB Atlas (mude .env)
```

### Erro: "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Página branca ao abrir frontend
- Verifique console do navegador (F12)
- Verifique se backend está rodando
- Limpe cache: `Ctrl+Shift+Delete`

---

## 📚 Documentação Para Ler

### Obrigatória (leia hoje)
1. **INSTRUÇÕES_PT.md** - Guia completo em português
2. **QUICKSTART.md** - Início rápido

### Importante (leia essa semana)
1. **README.md** - Documentação oficial
2. **API_DOCS.md** - Como a API funciona
3. **ARCHITECTURE.md** - Como o sistema é estruturado

### Complementar (leia conforme necessário)
1. **ROADMAP.md** - Futuras funcionalidades
2. **BEST_PRACTICES.md** - Como programar bem
3. **COMPLETION.md** - O que foi implementado

---

## 🔧 Customizações Comuns

### Mudar Título da Página
Edite `Front-End/index.html`, procure por `<title>`

### Mudar Cores
Edite os arquivos CSS:
- `Front-End/src/App.css` - Cores globais
- `Front-End/src/pages/Login/styles.css` - Login
- `Front-End/src/pages/Admin/styles.css` - Admin

### Adicionar Nova Página
1. Crie pasta em `Front-End/src/pages/NovaPagina/`
2. Crie `index.jsx` e `styles.css`
3. Importe em `App.jsx`
4. Adicione rota

### Adicionar Novo Campo ao Usuário
1. Edite `Back-End/models/Usuario.js`
2. Adicione novo campo no schema
3. Atualize o controller
4. Atualize o frontend conforme necessário

---

## 🚀 Deploy (Futuro)

### Quando Quiser Colocar em Produção

1. **Backend:**
   - Hospedagem: Heroku, Railway, DigitalOcean
   - Banco: MongoDB Atlas
   - Domínio: GoDaddy, Namecheap

2. **Frontend:**
   - Hospedagem: Vercel, Netlify
   - Build: `npm run build`
   - Deploy: Push para branch `main`

3. **Checklist Pre-Deploy:**
   - [ ] Todas as variáveis de ambiente configuradas
   - [ ] HTTPS habilitado
   - [ ] CORS configurado corretamente
   - [ ] Backup do banco feito
   - [ ] Testes executados

---

## 💡 Dicas Finais

1. **Sempre use Ctrl+C** para parar servidores (não feche a janela)
2. **Use devTools do navegador** para debugar (F12)
3. **Leia os logs** do terminal, eles falam muito
4. **Faça backups** frequentes do banco de dados
5. **Use MongoDB Atlas** para desenvolvimento (gratuito e na nuvem)
6. **Teste no celular** - O sistema é responsivo

---

## ❓ Ainda Tem Dúvidas?

1. **Leia o README.md** - Tem a maioria das respostas
2. **Consulte API_DOCS.md** - Para entender as rotas
3. **Estude ARCHITECTURE.md** - Para entender a estrutura
4. **Procure por padrões** no código existente

---

## ✅ Você Está Pronto!

Parabéns! Você tem tudo que precisa para:
- ✅ Rodar o sistema localmente
- ✅ Gerenciar usuários como admin
- ✅ Criar e executar treinos como usuário
- ✅ Entender o código
- ✅ Fazer customizações
- ✅ Deployar para produção

**Bora começar!** 🚀

---

**Última atualização:** 2026
