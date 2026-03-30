import { exercicios } from "../../data/exercicios.js"
import { useState } from "react"
import './styles.css'
import { useNavigate, useParams, useLocation } from "react-router-dom"

function MontarTreino(){
  const [treino, setTreino] = useState([])
  const [abaAtiva, setAbaAtiva] = useState('peito')
  const [busca, setBusca] = useState('')
  const [painelAberto, setPainelAberto] = useState(true)
  const [nomeTreino, setNomeTreino] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()
  const { usuarioId } = useParams()
  const location = useLocation()
  const usuarioNome = location.state?.usuarioNome || null

  const grupos = {
    peito: { nome: 'Peito',  exercicios: exercicios.peito },
    costas: { nome: 'Costas', exercicios: exercicios.costas },
    ombro: { nome: 'Ombro', exercicios: exercicios.ombro },
    perna: { nome: 'Perna', exercicios: exercicios.perna },
    biceps: { nome: 'Bíceps', exercicios: exercicios.biceps },
    triceps: { nome: 'Tríceps', exercicios: exercicios.triceps }
  }

  function toggleExercicio(exercicio){
    const jaAdicionado = treino.some(ex => ex.nome === exercicio.nome)
    if (jaAdicionado) {
      setTreino(treino.filter(ex => ex.nome !== exercicio.nome))
    } else {
      setTreino([...treino, exercicio])
    }
  }

  function removerExercicio(nomeExercicio){
    setTreino(treino.filter(ex => ex.nome !== nomeExercicio))
  }

  function filtarExercicios(lista) {
    if (!busca.trim()) return lista
    return lista.filter(ex => ex.nome.toLowerCase().includes(busca.toLowerCase()))
  }

  function salvarTreino() {
    if (treino.length === 0) {
      alert('Adicione ao menos um exercício antes de salvar.')
      return
    }
    if (!nomeTreino.trim()) {
      alert('Digite um nome para o treino')
      return
    }

    // Salva temporário e joga as variáveis para a próxima tela
    localStorage.setItem('treinoSelecionado', JSON.stringify(treino))
    navigate('/definir-series', { state: { usuarioId, usuarioNome, nomeTreino } })
  }

  const exerciciosAtuais = filtarExercicios(grupos[abaAtiva].exercicios)

  return(
    <div className="montar-treino-wrapper">
      {/* PAINEL ESQUERDO - EXERCÍCIOS SELECIONADOS */}
      <div className={`painel-selecionados ${painelAberto ? 'aberto' : 'fechado'}`}>
        <div className="painel-header">
          <h3>📋 Selecionados</h3>
          <button 
            className="btn-toggle-painel"
            onClick={() => setPainelAberto(!painelAberto)}
            title={painelAberto ? 'Fechar' : 'Abrir'}
          >
            {painelAberto ? '▶️' : '◀️'}
          </button>
        </div>

        {painelAberto && (
          <div className="painel-conteudo">
            {treino.length === 0 ? (
              <p className="vazio">Nenhum exercício selecionado</p>
            ) : (
              <>
                <div className="contador">
                  <span className="badge">{treino.length}</span>
                  <strong>exercícios</strong>
                </div>
                <div className="lista-selecionados">
                  {treino.map((ex, idx) => (
                    <div key={idx} className="selecionado-item">
                      <span>{ex.nome}</span>
                      <button 
                        className="btn-remover"
                        onClick={() => removerExercicio(ex.nome)}
                        title="Remover"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="montar-treino-main">
        <header className="treino-header">
          <div>
            <h1>🏋️ Montar Treino</h1>
            <p>{usuarioId ? `Para: ${usuarioNome}` : 'Selecione seus exercícios'}</p>
          </div>
        </header>

        <div className="campo-nome-treino">
          <input
            type="text"
            placeholder="Nome do treino..."
            value={nomeTreino}
            onChange={(e) => setNomeTreino(e.target.value)}
            maxLength={50}
          />
          <small>({nomeTreino.length}/50)</small>
        </div>

        {/* BARRA DE BUSCA */}
        <div className="busca-container">
          <input
            type="text"
            placeholder="🔍 Buscar exercício..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-busca"
          />
          {busca && (
            <button 
              className="btn-limpar-busca"
              onClick={() => setBusca('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* ABAS DOS GRUPOS MUSCULARES */}
        <div className="abas-container">
          {Object.entries(grupos).map(([chave, grupo]) => (
            <button
              key={chave}
              className={`aba ${abaAtiva === chave ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva(chave)}
            >
              <span className="emoji">{grupo.emoji}</span>
              <span className="nome">{grupo.nome}</span>
            </button>
          ))}
        </div>

        {/* EXERCÍCIOS EM GRID */}
        <div className="exercicios-container">
          {exerciciosAtuais.length === 0 ? (
            <div className="sem-resultados">
              <p>😅 Nenhum exercício encontrado</p>
              <small>Tente outro termo de busca</small>
            </div>
          ) : (
            <div className="exercicios-grid">
              {exerciciosAtuais.map((exercicio, index) => (
                <label key={index} className="exercicio-card">
                  <input
                    type="checkbox"
                    checked={treino.some(ex => ex.nome === exercicio.nome)}
                    onChange={() => toggleExercicio(exercicio)}
                  />
                  <div className="card-content">
                    <span className="checkmark">✓</span>
                    <span className="nome-exercicio">{exercicio.nome}</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* BOTÃO SALVAR FLUTUANTE */}
        {treino.length > 0 && (
          <button className="save-btn-flutuante" onClick={salvarTreino} disabled={!nomeTreino.trim()}>
            ✅ Continuar para Séries
          </button>
        )}

        {/* BOTÃO SALVAR TRADICIONAL */}
        <div className="botoes-footer">
          <button className="save-btn" onClick={salvarTreino} disabled={!nomeTreino.trim()}>
            Salvar treino e ir para definir séries
          </button>
        </div>
      </div>

    </div>
  )
}

export default MontarTreino