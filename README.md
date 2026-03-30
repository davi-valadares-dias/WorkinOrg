# WorkinOrg - Sistema de Academia 🏋️

Um sistema completo de gerenciamento de academia com backend robusto e frontend moderno.

## 📋 Características

### Autenticação e Segurança
- ✅ Login de Administradores e Usuários
- ✅ Autenticação JWT
- ✅ Tokens com expiração de 24h
- ✅ Senhas criptografadas com bcryptjs

### Funcionalidades do Admin
- ✅ Dashboard com estatísticas
- ✅ Criar e gerenciar usuários
- ✅ Ver usuários online em tempo real
- ✅ Editar dados de usuários (peso, altura, medidas)
- ✅ Visualizar progresso dos usuários
- ✅ Adicionar comentários nos treinos

### Funcionalidades do Usuário
- ✅ Criar seus próprios treinos
- ✅ Usar treinos públicos da academia
- ✅ Registrar execução de treinos
- ✅ Visualizar histórico de treinos
- ✅ Acompanhar medidas do corpo
- ✅ Ver comentários do admin nos treinos

### Banco de Dados
- ✅ Modelos bem estruturados (Academia, Admin, Usuário, Treino, Histórico)
- ✅ Relacionamentos entre modelos
- ✅ Histórico de mudanças e execuções

---

## 🚀 Instalação e Configuração

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/) (instalado localmente ou [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 1. Configurar o Backend

```bash
cd Back-End
npm install
```

**Configurar variáveis de ambiente:**

Edite o arquivo `.env`:
```
MONGODB_URI=mongodb://localhost:27017/workinorg
JWT_SECRET=seu_secret_key_super_seguro_aqui_123456789
PORT=3000
NODE_ENV=development
```

**Se usar MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/workinorg
```

**Criar admin inicial:**

```bash
npm run seed
```

Isso criará:
- Academia: "Academia Padrão"
- Admin: email=admin@workinorg.com, senha=admin123

**Iniciar o backend:**

```bash
npm run dev
```

O servidor rodará em `http://localhost:3000`

---

### 2. Configurar o Frontend

```bash
cd Front-End
npm install
```

**Variáveis de ambiente (`.env`):**
```
VITE_API_URL=http://localhost:3000/api
```

**Iniciar o frontend:**

```bash
npm run dev
```

O site abrirá em `http://localhost:5173`

---

## 🔑 Credenciais Padrão

**Admin:**
- Email: `admin@workinorg.com`
- Senha: `admin123`

---

## 📱 Como Usar

### 1. Login como Admin

1. Acesse `http://localhost:5173`
2. Clique na aba "Administrador"
3. Digite as credenciais
4. Será redirecionado para o painel admin

### 2. Painel Admin

**Dashboard:**
- Ver estatísticas gerais
- Total de usuários
- Usuários online agora
- Taxa de atividade

**Usuários:**
- Lista completa de usuários
- Editar dados (peso, altura, medidas)
- Ver progresso de cada usuário
- Adicionar observações

**Online:**
- Ver quem está usando o sistema agora
- Usuários conectados em tempo real

**Criar Usuário:**
- Formulário para adicionar novo usuário
- Define peso, altura, idade, sexo
- Senhas criptografadas automaticamente

### 3. Criar Novo Usuário

1. No painel Admin, vá para "Criar Usuário"
2. Preencha os campos (Nome, Email, Senha, Dados físicos)
3. Clique em "Criar Usuário"

### 4. Login como Usuário

1. Use o email e senha criados pelo admin
2. Acesse a página de início
3. Crie seus treinos ou use treinos públicos

---

## 🏗️ Estrutura do Projeto

```
WorkinOrg/
├── Back-End/
│   ├── models/
│   │   ├── Academia.js
│   │   ├── Admin.js
│   │   ├── Usuario.js
│   │   ├── Treino.js
│   │   └── HistoricoTreino.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   └── treinoRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   └── treinoController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── index.js
│   ├── seed.js
│   └── .env
│
└── Front-End/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   └── RotaProtegida.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── pages/
    │   │   ├── Login/
    │   │   ├── Admin/
    │   │   └── ... (outras páginas)
    │   └── App.jsx
    └── .env
```

---

## 🔗 Endpoints da API

### Autenticação
- `POST /api/auth/login-admin` - Login de admin
- `POST /api/auth/login-usuario` - Login de usuário
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verificar-sessao` - Verificar token

### Admin (requer autenticação + role admin)
- `POST /api/admin/usuarios/criar` - Criar usuário
- `GET /api/admin/usuarios` - Listar usuários
- `PUT /api/admin/usuarios/:usuarioId` - Editar usuário
- `GET /api/admin/usuarios-online` - Ver online
- `POST /api/admin/treinos/:treinoId/comentarios` - Adicionar comentário

### Treinos (requer autenticação)
- `POST /api/treinos/criar` - Criar treino
- `GET /api/treinos/meus-treinos` - Listar meus treinos
- `GET /api/treinos/treinos-publicos` - Treinos públicos
- `POST /api/treinos/:treinoId/adicionar` - Adicionar treino
- `POST /api/treinos/:treinoId/executar` - Registrar execução
- `GET /api/treinos/historico` - Histórico de execuções

---

## 🎨 Customização

### Cores e Tema

O sistema usa:
- Cor principal: `#FFC107` (Amarelo)
- Cor secundária: `#4caf50` (Verde)
- Background: Tons de preto e cinza

Edite os arquivos `.css` das páginas para customizar.

---

## 🐛 Troubleshooting

**Erro: "MongoDB conectado com sucesso" mas não funciona**
- Verifique se MongoDB está rodando: `mongod`
- Se usar Atlas, verifique a connection string

**Erro: Login falha**
- Certifique-se que o backend está rodando (porta 3000)
- Verifique credenciais (admin@workinorg.com / admin123)

**CORS Error**
- Backend já tem CORS ativado
- Se adicionar proxies, verifique configurações

---

## 📝 Próximos Passos

Para melhorar ainda mais o sistema:

1. **Adicionar mais funcionalidades de treino:**
   - Vídeos de exercícios
   - Progressão de carga
   - Planos pré-definidos

2. **Sistema de Planos/Pagamentos:**
   - Diferentes planos de academia
   - Integração com pagamento

3. **Analytics e Relatórios:**
   - Gráficos de progresso
   - Estatísticas detalhadas
   - Exportar relatórios

4. **Notificações:**
   - Push notifications
   - Email de atividades

5. **Mobile App:**
   - Versão mobile nativa
   - App para iOS/Android

---

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar!

---

## 👨‍💻 Desenvolvido com ❤️

Se tiver dúvidas ou sugestões, entre em contato!

**Versão:** 1.0.0  
**Última atualização:** 2026
