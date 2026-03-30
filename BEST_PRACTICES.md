# 🎯 Melhores Práticas - WorkinOrg

Um guia para desenvolvedores sobre as melhores práticas ao trabalhar com o WorkinOrg.

---

## 🚀 Fluxo de Desenvolvimento

### 1. Antes de Começar uma Feature

```bash
# Atualize a branch principal
git checkout main
git pull origin main

# Crie uma branch para sua feature
git checkout -b feature/minha-feature
```

### 2. Estrutura de Commits

```bash
# ✅ BOM
git commit -m "feat: adicionar listagem de treinos"
git commit -m "fix: corrigir erro ao deletar usuário"
git commit -m "refactor: limpar código do controller"

# ❌ RUIM
git commit -m "mudanças"
git commit -m "ajustes"
git commit -m "fix bug"
```

### 3. Ao Finalizar

```bash
git push origin feature/minha-feature
# Abra um Pull Request no GitHub
```

---

## 📝 Padrões de Código

### Backend (JavaScript/Node)

#### Nomenclatura
```javascript
// ✅ BOM
const buscarUsuarios = async () => {}
const verificarAutenticacao = (req, res, next) => {}
const usuariosPorAcademia = []

// ❌ RUIM
const getp = async () => {}
const va = (a, b, c) => {}
const u = []
```

#### Estrutura de Controlador
```javascript
// ✅ BOM - Sempre retorna resposta estruturada
const criar = async (req, res) => {
  try {
    const { nome, email } = req.body;
    
    // Validação
    if (!nome || !email) {
      return res.status(400).json({ erro: 'Campos obrigatórios' });
    }
    
    // Lógica
    const novo = await Model.create({ nome, email });
    
    // Resposta
    return res.status(201).json({
      mensagem: 'Criado com sucesso',
      dados: novo
    });
  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ erro: 'Erro ao criar' });
  }
};

// ❌ RUIM - Código desestruturado
const criar = (a, b) => {
  var c = new Model(a);
  c.save();
  b.send(c);
};
```

#### Validação sempre!
```javascript
// ✅ BOM
if (!usuario.email || !usuario.email.includes('@')) {
  return res.status(400).json({ erro: 'Email inválido' });
}

// ❌ RUIM
const { email } = usuario; // Sem validação
```

---

## 🎨 Frontend (React)

### Nomenclatura de Componentes
```javascript
// ✅ BOM - PascalCase para componentes
export function ListaUsuarios() {}
export function EditarUsuario() {}
export function Loading() {}

// ❌ RUIM
export function listaUsuarios() {}
export function editar_usuario() {}
export function load() {}
```

### Componentes Funcionais
```javascript
// ✅ BOM - Usar hooks
function SetUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    carregarUsuarios();
  }, []);

  return <div>{usuarios.map(u => <p key={u.id}>{u.nome}</p>)}</div>;
}

// ❌ RUIM - Componentes de classe (obsoleto)
class SetUsers extends React.Component {}
```

### Props e Destructuring
```javascript
// ✅ BOM - Destructuring com prop types
function Card({ titulo, descricao, ativo = true }) {
  return <div>{titulo}</div>;
}

// ❌ RUIM
function Card(props) {
  const titulo = props.titulo;
  const descricao = props.descricao;
}
```

### Chamadas à API
```javascript
// ✅ BOM - Com tratamento de erro
const carregarDados = async () => {
  setCarregando(true);
  try {
    const response = await fetch('url', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Erro ao carregar');
    const data = await response.json();
    setDados(data);
  } catch (error) {
    setErro(error.message);
  } finally {
    setCarregando(false);
  }
};

// ❌ RUIM
fetch('url').then(r => r.json()).then(d => setDados(d));
```

---

## 🗄️ Banco de Dados

### Nomes de Collections
```javascript
// ✅ BOM - Plural, minúscula
usuarios
treinos
academias
historicos

// ❌ RUIM
User
Treino_Do_Usuário
Academys
```

### Índices para Performance
```javascript
// ✅ BOM - Adicionar índices para buscas frequentes
usuarioSchema.index({ email: 1 });
usuarioSchema.index({ academia: 1, ativo: 1 });

// ❌ RUIM - Sem índices
// Consultas lentas em coleções grandes
```

### Evitar N+1 Queries
```javascript
// ✅ BOM - Usar populate
const usuarios = await Usuario.find()
  .populate('academia')
  .populate('adminCriador');

// ❌ RUIM - Carregar academia em loop
let usuarios = await Usuario.find();
usuarios = usuarios.map(async (u) => ({
  ...u,
  academia: await Academia.findById(u.academia) // N+1!
}));
```

---

## 🔐 Segurança

### Verificação de Autenticação SEMPRE
```javascript
// ✅ BOM - Toda rota protegida
router.post('/criar', autenticar, verificarAdmin, criar);

// ❌ RUIM
router.post('/criar', criar); // Sem proteção!
```

### Variáveis Sensíveis
```javascript
// ✅ BOM - No .env
require('dotenv').config();
const secret = process.env.JWT_SECRET;

// ❌ RUIM
const secret = 'meu-secret-muito-secreto-123'; // Exposto no git!
```

### Hash de Senhas
```javascript
// ✅ BOM
const hash = await bcrypt.hash(senha, 10);
const valida = await bcrypt.compare(senha, hash);

// ❌ RUIM
const senha_hash = Buffer.from(senha).toString('base64'); // Inseguro!
```

---

## 📊 Performance

### Lazy Loading
```javascript
// ✅ BOM
const Admin = React.lazy(() => import('./pages/Admin'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Suspense>
  );
}

// ❌ RUIM
import Admin from './pages/Admin'; // Carrega tudo de uma vez
```

### Memoização
```javascript
// ✅ BOM - Evita re-renders desnecessários
const ListaUsuarios = React.memo(function ListaUsuarios({ usuarios }) {
  return usuarios.map(u => <p key={u.id}>{u.nome}</p>);
});

// ❌ RUIM
function ListaUsuarios({ usuarios }) {
  return usuarios.map(u => <p key={u.id}>{u.nome}</p>);
}
// Re-renderiza sempre que o pai renderiza
```

### Paginação
```javascript
// ✅ BOM - Limitar dados retornados
router.get('/usuarios', async (req, res) => {
  const { limite = 10, pagina = 1 } = req.query;
  const skip = (pagina - 1) * limite;
  
  const usuarios = await Usuario.find()
    .limit(parseInt(limite))
    .skip(skip);
});

// ❌ RUIM
const usuarios = await Usuario.find(); // Pode ser MILHÕES de registros!
```

---

## 🧪 Testes

### Estrutura de Testes
```bash
# ✅ BOM - Bem organizado
tests/
├── unit/
│   ├── auth.test.js
│   └── admin.test.js
├── integration/
│   ├── api.test.js
│   └── database.test.js
└── fixtures/
    └── mockData.js

# ❌ RUIM
test.js
admin_test.js
api_t.js
```

### Exemplo de Teste
```javascript
// ✅ BOM
describe('Admin Controller', () => {
  it('deve criar usuário com sucesso', async () => {
    const usuario = await criarUsuario({
      nome: 'João',
      email: 'joao@test.com'
    });
    expect(usuario.email).toBe('joao@test.com');
  });

  it('deve retornar erro com email inválido', async () => {
    try {
      await criarUsuario({ nome: 'João', email: 'invalido' });
      fail('Deveria ter lançado erro');
    } catch (error) {
      expect(error.message).toContain('Email inválido');
    }
  });
});
```

---

## 📋 Listas de Verificação

### Antes de fazer um Commit

- [ ] Código funciona localmente
- [ ] Sem console.log() de debug
- [ ] Sem credenciais expostas
- [ ] Padrão de código seguido
- [ ] Mensagem de commit clara
- [ ] Testado em diferentes cenários

### Antes de fazer um Push

- [ ] Branch atualizada com main (`git pull origin main`)
- [ ] Conflict resolvidos
- [ ] Sem arquivos desnecessários
- [ ] Documentação atualizada
- [ ] Testes passando

### Antes de fazer PR

- [ ] Descrição clara do que muda
- [ ] Screenshots se tiver mudança visual
- [ ] Referência a issues relacionadas
- [ ] Reviewers selecionados

---

## 🚨 Erros Comuns

### Async/Await
```javascript
// ❌ ERRADO
const usuarios = await Usuario.find(); // Tá OK mas...
res.json(usuarios); // E se await falhar?

// ✅ CORRETO
try {
  const usuarios = await Usuario.find();
  res.json(usuarios);
} catch (error) {
  res.status(500).json({ erro: error.message });
}
```

### State React
```javascript
// ❌ ERRADO - Modificar state diretamente
setState(usuario);
usuario.nome = 'Novo Nome';
setState(usuario); // React não detecta mudança!

// ✅ CORRETO - Criar novo objeto
setState({ ...usuario, nome: 'Novo Nome' });
```

### Promises
```javascript
// ❌ ERRADO - Não validar promise
Promise.all([promise1, promise2])
  .then(results => {
    // E se rejeitarem?
  });

// ✅ CORRETO
Promise.all([promise1, promise2])
  .then(results => { /* sucesso */ })
  .catch(error => { /* erro */ });
```

---

## 📚 Referências

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Best Practices](https://react.dev)
- [MongoDB Best Practices](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com)

---

## 🎓 Aprendendo

Quer melhorar ainda mais?

1. Leia o código existente
2. Estude os padrões usados
3. Pratique refatoração
4. Coloque em produção
5. Aprenda com experiências reais

---

**Última atualização:** 2026
