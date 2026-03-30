import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import './styles.css'

function TreinoMontado(){
    const [treino, setTreino] = useState([])
    const [nomeTreino, setNomeTreino] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
      const saved = localStorage.getItem('treinoMontado')
      if (saved) {
        try {
          setTreino(JSON.parse(saved))
        } catch {
          setTreino([])
        }
      }
    }, [])

    function salvarTreinoPermanente() {
      if (!nomeTreino.trim()) {
        alert('Digite um nome para o treino.')
        return
      }
      const treinosSalvos = JSON.parse(localStorage.getItem('treinosSalvos') || '[]')
      treinosSalvos.push({ nome: nomeTreino, exercicios: treino })
      localStorage.setItem('treinosSalvos', JSON.stringify(treinosSalvos))
      alert('Treino salvo com sucesso!')
      setNomeTreino('')
      localStorage.removeItem('treinoMontado')
      setTreino([])
    }

    function refazerTreino() {
      navigate('/montar')
    }

    return(
        <div className="treino-montado-container">
            <h1>Treino Montado</h1>
            {treino.length === 0 ? (
              <p>Nenhum treino encontrado. Complete a montagem primeiro.</p>
            ) : (
              <div>
                <ul>
                  {treino.map((ex, index) => (
                    <li key={index}>
                      {typeof ex === 'string' ? ex : `${ex.exercicio} - ${ex.series} séries x ${ex.repeticoes} repetições`}
                    </li>
                  ))}
                </ul>
                <input
                  type="text"
                  placeholder="Nome do treino"
                  value={nomeTreino}
                  onChange={(e) => setNomeTreino(e.target.value)}
                />
                <button onClick={salvarTreinoPermanente}>Salvar Treino</button>
                <button onClick={refazerTreino}>Refazer Treino</button>
              </div>
            )}
        </div>
    )
}

export default TreinoMontado

