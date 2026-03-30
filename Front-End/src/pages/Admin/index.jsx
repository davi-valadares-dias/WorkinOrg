import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './styles.css';

function Admin() {
  const { token, admin } = useAuth();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('dashboard');
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosOnline, setUsuariosOnline] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  
  // Formulário criar usuário
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    idade: '',
    sexo: '',
    peso: '',
    altura: ''
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Estado para editar usuário
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [usuarioEditarDados, setUsuarioEditarDados] = useState({});
  const [senhaAtual, setSenhaAtual] = useState('');
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  
  // Estado Histórico
  const [historicoUsuario, setHistoricoUsuario] = useState([]);
  const [modalHistorico, setModalHistorico] = useState(false);
  const [nomeUsuarioHistorico, setNomeUsuarioHistorico] = useState('');

  // Carregar usuários
  const carregarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/usuarios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data.usuarios);
      } else {
        setErro('Erro ao carregar usuários');
      }
    } catch (err) {
      setErro('Erro ao conectar com servidor');
      console.error(err);
    }
  };

  // Carregar usuários online
  const carregarOnline = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/usuarios-online', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsuariosOnline(data.usuariosOnline);
      }
    } catch (err) {
      console.error('Erro ao carregar online:', err);
    }
  };

  useEffect(() => {
    if (token) {
      carregarUsuarios();
      carregarOnline();
      
      // Atualizar a cada 30 segundos
      const intervalo = setInterval(carregarOnline, 30000);
      return () => clearInterval(intervalo);
    }
    setCarregando(false);
  }, [token]);

  // Criar novo usuário
  const handleCriarUsuario = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/admin/usuarios/criar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(novoUsuario)
      });

      const data = await response.json();
      if (response.ok) {
        setUsuarios([...usuarios, data.usuario]);
        setNovoUsuario({
          nome: '', email: '', senha: '', idade: '', sexo: '', peso: '', altura: ''
        });
        alert('✅ Usuário criado com sucesso!');
      } else {
        alert('❌ ' + (data.erro || 'Erro ao criar usuário'));
      }
    } catch (err) {
      alert('Erro ao conectar com servidor');
      console.error(err);
    }
  };

  // Atualizar usuário
  const handleAtualizarUsuario = async (usuarioId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(usuarioEditarDados)
      });

      const data = await response.json();
      if (response.ok) {
        setUsuarios(usuarios.map(u => u._id === usuarioId ? data.usuario : u));
        
        // Se há nova senha, atualizar também
        if (novaSenha.trim()) {
          await atualizarSenhaUsuario(usuarioId);
        }
        
        setUsuarioEditar(null);
        alert('✅ Usuário atualizado com sucesso!');
      } else {
        alert('❌ ' + (data.erro || 'Erro ao atualizar'));
      }
    } catch (err) {
      alert('Erro ao conectar com servidor');
      console.error(err);
    }
  };

  // Atualizar senha do usuário
  const atualizarSenhaUsuario = async (usuarioId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/usuarios/${usuarioId}/atualizar-senha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ novaSenha })
      });

      const data = await response.json();
      if (response.ok) {
        alert('✅ Senha atualizada com sucesso!');
      } else {
        alert('❌ ' + (data.erro || 'Erro ao atualizar senha'));
      }
    } catch (err) {
      alert('Erro ao conectar com servidor');
      console.error(err);
    }
  };

  const abrirEditarUsuario = async (usuario) => {
    setUsuarioEditar(usuario._id);
    setUsuarioEditarDados({
      nome: usuario.nome,
      idade: usuario.idade,
      sexo: usuario.sexo,
      peso: usuario.medidas?.peso?.valor,
      altura: usuario.medidas?.altura,
      observacoes: usuario.observacoes
    });
    
    // Carregar senha atual
    try {
      const response = await fetch(`http://localhost:3000/api/admin/usuarios/${usuario._id}/senha`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSenhaAtual(data.senha);
      }
    } catch (err) {
      console.error('Erro ao carregar senha:', err);
    }
    
    // Resetar nova senha
    setNovaSenha('');
    setMostrarSenhaAtual(false);
    setMostrarNovaSenha(false);
  };

  const irParaMontarTreino = (usuarioId, usuarioNome) => {
    navigate(`/montar-treinos/${usuarioId}`, { state: { usuarioNome } });
  };

  // Ver histórico do Usuário
  const abrirHistorico = async (usuario) => {
    setNomeUsuarioHistorico(usuario.nome);
    try {
      const res = await fetch(`http://localhost:3000/api/admin/usuarios/${usuario._id}/historico`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setHistoricoUsuario(data.historico || []);
      setModalHistorico(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🏋️ Painel Administrativo</h1>
        <p className="academia-name">Academia: {admin?.academia?.nome}</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab ${abaAtiva === 'dashboard' ? 'ativo' : ''}`}
          onClick={() => setAbaAtiva('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab ${abaAtiva === 'usuarios' ? 'ativo' : ''}`}
          onClick={() => setAbaAtiva('usuarios')}
        >
          👥 Usuários ({usuarios.length})
        </button>
        <button
          className={`tab ${abaAtiva === 'online' ? 'ativo' : ''}`}
          onClick={() => setAbaAtiva('online')}
        >
          🟢 Online ({usuariosOnline.length})
        </button>
        <button
          className={`tab ${abaAtiva === 'criar' ? 'ativo' : ''}`}
          onClick={() => setAbaAtiva('criar')}
        >
          ➕ Criar Usuário
        </button>
      </div>

      {erro && <div className="erro-alert">{erro}</div>}

      {abaAtiva === 'dashboard' && (
        <div className="aba-conteudo">
          <div className="dashboard-cards">
            <div className="card-info">
              <div className="card-numero">{usuarios.length}</div>
              <div className="card-label">Total de Usuários</div>
            </div>
            <div className="card-info online">
              <div className="card-numero">{usuariosOnline.length}</div>
              <div className="card-label">Usuários Online</div>
            </div>
            <div className="card-info">
              <div className="card-numero">{Math.round((usuariosOnline.length / (usuarios.length || 1)) * 100)}%</div>
              <div className="card-label">Taxa de Atividade</div>
            </div>
            <div className="card-info">
              <div className="card-numero">{admin?.academia?.ativa ? '✅' : '❌'}</div>
              <div className="card-label">Status Academia</div>
            </div>
          </div>
        </div>
      )}

      {abaAtiva === 'usuarios' && (
        <div className="aba-conteudo">
          <div className="usuarios-lista">
            <h2>📋 Usuários Cadastrados</h2>
            {usuarios.length === 0 ? (
              <p>Nenhum usuário cadastrado.</p>
            ) : (
              <table className="usuarios-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Peso</th>
                    <th>Altura</th>
                    <th>IMC</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario._id}>
                      <td>{usuario.nome}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.medidas?.peso?.valor || '-'} kg</td>
                      <td>{usuario.medidas?.altura || '-'} cm</td>
                      <td>{usuario.medidas?.imc || '-'}</td>
                      <td>
                        <div className="acoes-buttons">
                          <button
                            className="btn-treino"
                            onClick={() => irParaMontarTreino(usuario._id, usuario.nome)}
                            title="Montar treino para este usuário"
                          >
                            🏋️ Treino
                          </button>
                          <button
                            className="btn-treino"
                            style={{ backgroundColor: '#2196F3' }}
                            onClick={() => abrirHistorico(usuario)}
                            title="Ver histórico de execução"
                          >
                            📜 Histórico
                          </button>
                          <button
                            className="btn-editar"
                            onClick={() => abrirEditarUsuario(usuario)}
                          >
                            ✏️ Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {/* MODAL HISTÓRICO */}
            {modalHistorico && (
              <div className="modal-editar" onClick={() => setModalHistorico(false)}>
                <div className="modal-conteudo" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                  <h3>Histórico de Execuções - {nomeUsuarioHistorico}</h3>
                  <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '1rem', textAlign: 'left' }}>
                    {historicoUsuario.length === 0 ? (
                      <p>Nenhum treino concluído por este usuário.</p>
                    ) : (
                      historicoUsuario.map(hist => (
                        <div key={hist._id} style={{ borderBottom: '1px solid #444', paddingBottom: '1rem', marginBottom: '1rem' }}>
                          <h4 style={{ color: '#FFC107', margin: '0 0 5px 0' }}>{hist.treino?.nome || 'Treino Removido'}</h4>
                          <small>Data: {new Date(hist.dataExecucao).toLocaleString()}</small>
                          <p>Duração: {Math.floor(hist.duracao / 60)}m {hist.duracao % 60}s</p>
                          <div style={{ background: '#222', padding: '10px', borderRadius: '5px' }}>
                            {hist.exercicios && hist.exercicios.map((ex, idx) => (
                              <p key={idx} style={{ margin: '5px 0', fontSize: '13px' }}>
                                <strong>{ex.nome}:</strong> {ex.observacao || 'Sem pesos gravados'}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="modal-buttons" style={{ marginTop: '1rem' }}>
                    <button type="button" className="btn-cancelar" onClick={() => setModalHistorico(false)}>
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {usuarioEditar && (
              <div className="modal-editar">
                <div className="modal-conteudo">
                  <h3>Editar Dados do Usuário</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleAtualizarUsuario(usuarioEditar);
                  }}>
                    <input
                      type="text"
                      value={usuarioEditarDados.nome || ''}
                      onChange={(e) => setUsuarioEditarDados({...usuarioEditarDados, nome: e.target.value})}
                      placeholder="Nome"
                    />
                    <input
                      type="number"
                      value={usuarioEditarDados.idade || ''}
                      onChange={(e) => setUsuarioEditarDados({...usuarioEditarDados, idade: e.target.value})}
                      placeholder="Idade"
                    />
                    <input
                      type="number"
                      value={usuarioEditarDados.peso || ''}
                      onChange={(e) => setUsuarioEditarDados({...usuarioEditarDados, peso: e.target.value})}
                      placeholder="Peso (kg)"
                      step="0.1"
                    />
                    <input
                      type="number"
                      value={usuarioEditarDados.altura || ''}
                      onChange={(e) => setUsuarioEditarDados({...usuarioEditarDados, altura: e.target.value})}
                      placeholder="Altura (cm)"
                    />
                    <textarea
                      value={usuarioEditarDados.observacoes || ''}
                      onChange={(e) => setUsuarioEditarDados({...usuarioEditarDados, observacoes: e.target.value})}
                      placeholder="Observações"
                    />

                    {/* SEÇÃO DE SENHA */}
                    <div className="secao-senha">
                      <h4>🔐 Gerenciar Senha</h4>
                      
                      {/* Senha Atual */}
                      <div className="input-senha-wrapper">
                        <label>Senha Atual:</label>
                        <div className="campo-senha">
                          <input
                            type={mostrarSenhaAtual ? 'text' : 'password'}
                            value={senhaAtual}
                            readOnly
                            style={{ cursor: 'not-allowed', opacity: 0.7 }}
                          />
                          <button
                            type="button"
                            className="btn-toggle-senha"
                            onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                            title={mostrarSenhaAtual ? 'Ocultar' : 'Mostrar'}
                          >
                            {mostrarSenhaAtual ? '🙈' : '👁️'}
                          </button>
                        </div>
                      </div>

                      {/* Nova Senha */}
                      <div className="input-senha-wrapper">
                        <label>Nova Senha (opcional):</label>
                        <div className="campo-senha">
                          <input
                            type={mostrarNovaSenha ? 'text' : 'password'}
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            placeholder="Deixe em branco para não alterar"
                          />
                          <button
                            type="button"
                            className="btn-toggle-senha"
                            onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                            title={mostrarNovaSenha ? 'Ocultar' : 'Mostrar'}
                          >
                            {mostrarNovaSenha ? '🙈' : '👁️'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="modal-buttons">
                      <button type="submit" className="btn-salvar">Salvar</button>
                      <button type="button" className="btn-cancelar" onClick={() => setUsuarioEditar(null)}>Cancelar</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {abaAtiva === 'online' && (
        <div className="aba-conteudo">
          <h2>🟢 Usuários Online</h2>
          {usuariosOnline.length === 0 ? (
            <p>Nenhum usuário online.</p>
          ) : (
            <div className="online-grid">
              {usuariosOnline.map((usuario) => (
                <div key={usuario._id} className="online-card">
                  <div className="status-dot">●</div>
                  <p>{usuario.nome}</p>
                  <small>{usuario.email}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {abaAtiva === 'criar' && (
        <div className="aba-conteudo">
          <div className="form-criar-usuario">
            <h2>➕ Criar Novo Usuário</h2>
            <form onSubmit={handleCriarUsuario}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Nome"
                  value={novoUsuario.nome}
                  onChange={(e) => setNovoUsuario({...novoUsuario, nome: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={novoUsuario.email}
                  onChange={(e) => setNovoUsuario({...novoUsuario, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="input-senha-wrapper">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="Senha"
                    value={novoUsuario.senha}
                    onChange={(e) => setNovoUsuario({...novoUsuario, senha: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    className="btn-toggle-senha-small"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    title={mostrarSenha ? 'Esconder senha' : 'Mostrar senha'}
                  >
                    {mostrarSenha ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <input
                  type="number"
                  placeholder="Idade"
                  value={novoUsuario.idade}
                  onChange={(e) => setNovoUsuario({...novoUsuario, idade: e.target.value})}
                />
              </div>
              <div className="form-row">
                <select value={novoUsuario.sexo} onChange={(e) => setNovoUsuario({...novoUsuario, sexo: e.target.value})}>
                  <option value="">Sexo</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="O">Outro</option>
                </select>
                <input
                  type="number"
                  placeholder="Peso (kg)"
                  value={novoUsuario.peso}
                  onChange={(e) => setNovoUsuario({...novoUsuario, peso: e.target.value})}
                  step="0.1"
                />
              </div>
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Altura (cm)"
                  value={novoUsuario.altura}
                  onChange={(e) => setNovoUsuario({...novoUsuario, altura: e.target.value})}
                />
              </div>
              <button type="submit" className="btn-criar">Criar Usuário</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
