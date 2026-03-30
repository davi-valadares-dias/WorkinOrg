# 🔌 Guia de Uso da API WorkinOrg

Exemplos práticos de como usar a API do WorkinOrg com `curl`, JavaScript ou Postman.

---

## 🔐 Autenticação

### Login Admin

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@workinorg.com",
    "senha": "admin123"
  }'
```

**Response (Sucesso):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "nome": "Administrador",
    "email": "admin@workinorg.com",
    "academia": {
      "_id": "507f1f77bcf86cd799439010",
      "nome": "Academia Padrão"
    },
    "fotoPerfil": null,
    "isAdmin": true
  }
}
```

### Login Usuário

```bash
curl -X POST http://localhost:3000/api/auth/login-usuario \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "senha": "senha123"
  }'
```

### Verificar Sessão

```bash
curl http://localhost:3000/api/auth/verificar-sessao \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 👥 Gerenciamento de Usuários (Admin)

### Criar Usuário

```bash
curl -X POST http://localhost:3000/api/admin/usuarios/criar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "senha": "senha123",
    "idade": 28,
    "sexo": "M",
    "peso": "75",
    "altura": "180"
  }'
```

### Listar Usuários

```bash
curl http://localhost:3000/api/admin/usuarios \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

**Response:**
```json
{
  "total": 5,
  "usuarios": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "nome": "João Silva",
      "email": "joao@example.com",
      "medidas": {
        "peso": {"valor": 75},
        "altura": 180,
        "imc": "23.1"
      },
      "ultimoLogin": "2026-03-29T10:30:00.000Z"
    }
  ]
}
```

### Editar Usuário

```bash
curl -X PUT http://localhost:3000/api/admin/usuarios/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -d '{
    "peso": "72.5",
    "altura": "180",
    "observacoes": "Progresso excelente este mês"
  }'
```

### Ver Usuários Online

```bash
curl http://localhost:3000/api/admin/usuarios-online \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

---

## 🏋️ Gerenciamento de Treinos

### Criar Treino

```bash
curl -X POST http://localhost:3000/api/treinos/criar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "nome": "Treino Peito e Costas",
    "descricao": "Treino de força para peito e costas",
    "tipo": "hipertrofia",
    "duracao": "60 minutos",
    "dificuldade": "moderado",
    "exercicios": [
      {
        "nome": "Supino",
        "musculos": ["peito"],
        "series": 4,
        "repeticoes": "8-10",
        "descanso": "2 minutos",
        "peso": 80
      },
      {
        "nome": "Paralela",
        "musculos": ["peito", "triceps"],
        "series": 3,
        "repeticoes": "8-12",
        "descanso": "1.5 minutos"
      }
    ],
    "publico": true
  }'
```

### Listar Meus Treinos

```bash
curl http://localhost:3000/api/treinos/meus-treinos \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Adicionar Treino para Usar

```bash
curl -X POST http://localhost:3000/api/treinos/ID_DO_TREINO/adicionar \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Registrar Execução de Treino

```bash
curl -X POST http://localhost:3000/api/treinos/ID_DO_TREINO/executar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "exercicios": [
      {
        "nome": "Supino",
        "series": [
          {"numero": 1, "repeticoes": 10, "peso": 80, "concluida": true},
          {"numero": 2, "repeticoes": 8, "peso": 85, "concluida": true},
          {"numero": 3, "repeticoes": 6, "peso": 90, "concluida": true}
        ]
      }
    ],
    "duracao": "55",
    "concluidoPercentual": 100,
    "energia": 4,
    "dor": 2,
    "comentario": "Treino excelente, senti força!"
  }'
```

### Visualizar Histórico

```bash
curl "http://localhost:3000/api/treinos/historico?limite=10&pagina=1" \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 📝 Comentários em Treinos (Admin)

```bash
curl -X POST http://localhost:3000/api/admin/treinos/ID_DO_TREINO/comentarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -d '{
    "texto": "Ótimo treino! Aumentou as séries com sucesso."
  }'
```

---

## 🧪 Testando com JavaScript

```javascript
// Config
const API_URL = 'http://localhost:3000/api';
let token = '';

// Login
async function fazerLogin(email, senha) {
  const response = await fetch(`${API_URL}/auth/login-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  const data = await response.json();
  token = data.token;
  return data;
}

// Criar Usuário
async function criarUsuario(dados) {
  const response = await fetch(`${API_URL}/admin/usuarios/criar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(dados)
  });
  return response.json();
}

// Usar
(async () => {
  await fazerLogin('admin@workinorg.com', 'admin123');
  
  const novoUsuario = await criarUsuario({
    nome: 'Maria Silva',
    email: 'maria@example.com',
    senha: 'senha123',
    peso: '65',
    altura: '165'
  });
  
  console.log(novoUsuario);
})();
```

---

## 🧪 Testando com Postman

1. Importe a coleção (ou crie manualmente)
2. Configure a variável `{{base_url}}` = `http://localhost:3000/api`
3. Configure a variável `{{token}}` após fazer login

**Exemplo de request pré-configurada:**

```
POST {{base_url}}/auth/login-admin
Content-Type: application/json

{
  "email": "admin@workinorg.com",
  "senha": "admin123"
}
```

Depois de fazer login, copie o `token` para a variável:
```
Authorization: Bearer {{token}}
```

---

## ✅ Código de Status HTTP

| Código | Significado |
|--------|------------|
| 200 | OK - Sucesso |
| 201 | Created - Recurso criado |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token inválido/expirado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 500 | Server Error - Erro no servidor |

---

## 🔒 Segurança

- Todos os tokens expiram em **24 horas**
- Use HTTPS em produção
- Nunca exponha tokens em URLs
- Guarde tokens de forma segura (localhost storage ou seguro)
- Implemente rate limiting em produção

---

## 📚 Referência Rápida

```
BASE URL: http://localhost:3000/api

Auth:
  POST   /auth/login-admin
  POST   /auth/login-usuario
  POST   /auth/logout
  GET    /auth/verificar-sessao

Admin:
  POST   /admin/usuarios/criar
  GET    /admin/usuarios
  PUT    /admin/usuarios/:id
  GET    /admin/usuarios-online
  POST   /admin/treinos/:id/comentarios

Treinos:
  POST   /treinos/criar
  GET    /treinos/meus-treinos
  GET    /treinos/treinos-publicos
  POST   /treinos/:id/adicionar
  POST   /treinos/:id/executar
  GET    /treinos/historico
```

---

## 🆘 Troubleshooting

**"Invalid token"**
- Token expirou? Faça login novamente
- Token está correto? Verifique se copiou inteiro

**"Cannot POST /api/..."**
- Verifique o método (POST, GET, PUT, etc)
- Verifique a rota
- Backend está rodando?

**"CORS Error"**
- Certifique-se que o backend tem CORS ativado
- Verifique a URL

---

**Último update:** 2026
