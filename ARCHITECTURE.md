# 🏗️ Arquitetura do WorkinOrg

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Login Page  │  Admin Dashboard  │  User Pages          │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          AuthContext (Estado Global)                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │     API Service (Chamadas HTTP)                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                    HTTP / JSON / JWT Token
                              │
┌─────────────────────────────────────────────────────────────────┐
│                  Backend (Express.js)                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Middleware de Autenticação (JWT)               │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Rotas & Controllers                        │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  Auth Routes     │  Admin Routes  │  Treino Routes  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Modelos (Mongoose)                        │  │
│  │  Academia │ Admin │ Usuario │ Treino │ HistoricoTreino │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                        MongoDB Wire
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB (Banco de Dados)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  academias_collection   │  admin_collection            │  │
│  │  usuarios_collection    │  treinos_collection          │  │
│  │  historicoTreinos_collection                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Pastas

```
WorkinOrg/
│
├── Back-End/
│   ├── models/                 # Modelos de dados (Mongoose)
│   │   ├── Academia.js
│   │   ├── Admin.js
│   │   ├── Usuario.js
│   │   ├── Treino.js
│   │   └── HistoricoTreino.js
│   │
│   ├── routes/                 # Definição de rotas
│   │   ├── authRoutes.js       # Login, logout, verificação
│   │   ├── adminRoutes.js      # Gerenciamento de usuários
│   │   └── treinoRoutes.js     # CRUD de treinos
│   │
│   ├── controllers/            # Lógica de negócio
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   └── treinoController.js
│   │
│   ├── middleware/             # Middleware (autenticação, etc)
│   │   └── auth.js
│   │
│   ├── index.js                # Arquivo principal
│   ├── seed.js                 # Script para criar dados iniciais
│   ├── .env                    # Variáveis de ambiente
│   ├── package.json
│   └── node_modules/
│
├── Front-End/
│   ├── src/
│   │   ├── context/            # Context API
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   └── RotaProtegida.jsx
│   │   │
│   │   ├── services/           # Serviços (API calls, utils)
│   │   │   └── api.js
│   │   │
│   │   ├── pages/              # Páginas
│   │   │   ├── Login/
│   │   │   ├── Admin/
│   │   │   ├── Treinos/
│   │   │   └── ... (outras páginas)
│   │   │
│   │   ├── App.jsx             # Componente principal
│   │   ├── App.css             # Estilos globais
│   │   ├── main.jsx            # Entry point
│   │   └── index.css
│   │
│   ├── .env                    # Variáveis de ambiente
│   ├── package.json
│   ├── vite.config.js
│   ├── node_modules/
│   └── public/
│
├── README.md                   # Documentação principal
├── QUICKSTART.md               # Início rápido
├── API_DOCS.md                 # Documentação da API
├── ROADMAP.md                  # Futuras features
└── setup.bat                   # Script de setup Windows
```

---

## 🔄 Fluxo de Dados

### Login Admin

```
1. Usuario preenche email/senha
   ↓
2. Frontend envia POST /api/auth/login-admin
   ↓
3. Backend:
   - Busca admin no MongoDB
   - Compara hash de senha
   - Gera JWT token
   ↓
4. Frontend armazena token
   ↓
5. Redireciona para /admin
```

### Criar Usuário (Admin)

```
1. Admin preenche dados do novo usuário
   ↓
2. Frontend envia POST /api/admin/usuarios/criar
   (com Authorization header)
   ↓
3. Middleware de autenticação valida token
   ↓
4. Backend:
   - Valida dados
   - Hash a senha
   - Cria usuário no MongoDB
   ↓
5. Frontend recebe sucesso
   ↓
6. Atualiza lista de usuários
```

### Executar Treino (Usuário)

```
1. Usuário realiza treino e clica "Concluir"
   ↓
2. Frontend valida dados de execução
   ↓
3. Envia POST /api/treinos/:id/executar
   (com exercises, tempo, nota, etc)
   ↓
4. Backend:
   - Cria registro em HistoricoTreino
   - Atualiza última execução no treino
   - Calcula estatísticas
   ↓
5. Frontend mostra sucesso
```

---

## 🔐 Segurança

### Autenticação
- JWT com expiração de 24h
- Tokens armazenados no localStorage
- Senhas criptografadas com bcryptjs (salt 10)

### Autorização
- Middleware `autenticar` valida token
- Middleware `verificarAdmin` permite apenas admins
- Middleware `verificarUsuario` permite users/admins

### Validação
- Validação de entrada no controller
- Sanitização de dados
- Verificação de permissões (usuário só vê dados próprios)

---

## 📊 Modelo de Dados

### Academia
```javascript
{
  nome: String,
  email: String,
  cnpj: String,
  telefone: String,
  endereco: String,
  // ... endereço completo
  imagemUrl: String,
  ativa: Boolean,
  criadoEm: Date
}
```

### Admin
```javascript
{
  nome: String,
  email: String (unique),
  senha: String (hashed),
  academia: ObjectId (ref Academia),
  online: Boolean,
  ultimoLogin: Date,
  permissoes: {
    gerenciarUsuarios: Boolean,
    gerenciarTreinos: Boolean,
    // ...
  },
  criadoEm: Date
}
```

### Usuario
```javascript
{
  nome: String,
  email: String (unique),
  senha: String (hashed),
  academia: ObjectId,
  adminCriador: ObjectId,
  medidas: {
    peso: { valor: Number, data: Date, historico: [] },
    altura: Number,
    peito: Number,
    cintura: Number,
    quadril: Number,
    braco: Number,
    perna: Number,
    imc: Number
  },
  online: Boolean,
  ultimoLogin: Date,
  plano: {
    tipo: String (basico/premium/elite),
    dataInicio: Date,
    dataTermino: Date,
    ativo: Boolean
  },
  criadoEm: Date
}
```

### Treino
```javascript
{
  nome: String,
  descricao: String,
  academia: ObjectId,
  criador: ObjectId (ref Usuario/Admin),
  criadorTipo: String (usuario/admin),
  exercicios: [{
    nome: String,
    musculos: [String],
    series: Number,
    repeticoes: String,
    peso: Number,
    videoUrl: String
  }],
  tipo: String (forca/hipertrofia/resistencia/cardio/etc),
  usuariosQueUsam: [{
    usuario: ObjectId,
    dataInicio: Date,
    ultimaExecucao: Date
  }],
  comentariosAdmin: [{
    admin: ObjectId,
    texto: String,
    criadoEm: Date
  }],
  publico: Boolean,
  ativo: Boolean,
  criadoEm: Date
}
```

### HistoricoTreino
```javascript
{
  usuario: ObjectId,
  treino: ObjectId,
  academia: ObjectId,
  dataExecucao: Date,
  exercicios: [{
    nome: String,
    series: [{
      numero: Number,
      repeticoes: Number,
      peso: Number,
      concluida: Boolean
    }]
  }],
  duracao: String,
  concluidoPercentual: Number,
  energia: Number (1-5),
  dor: Number (1-5),
  criadoEm: Date
}
```

---

## 🚀 Pipeline de Deployment

```
Desenvolvimento → Staging → Produção
                           ↓
                    Docker + EC2/Heroku
                           ↓
                    MongoDB Atlas ou RDS
                           ↓
                    CDN (CloudFlare)
```

---

## 📈 Escalabilidade

Para escalar o sistema:

1. **Backend:**
   - Usar Load Balancer (nginx)
   - Cache com Redis
   - Database replication

2. **Frontend:**
   - CDN para assets
   - Code splitting
   - Service workers para PWA

3. **Banco de Dados:**
   - Sharding por academia
   - Índices nas queries frequentes
   - Backup automático

---

## 🆘 Suporte e Manutenção

### Logs
```bash
# Backend
npm run dev   # Logs no console

# Frontend
console.log() ou DevTools
```

### Monitoramento
- New Relic / DataDog para performance
- Sentry para error tracking
- PM2 para gerenciar processos

### Backup
```bash
# MongoDB Atlas faz backup automático
# Ou configure localmente com cron
```

---

**Documentação atualizada em:** 2026
