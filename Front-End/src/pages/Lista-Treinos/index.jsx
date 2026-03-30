import { useEffect, useState } from "react"
import './styles.css'

function TreinoAtual(){
    const [treinosSalvos, setTreinosSalvos] = useState([])

    useEffect(() => {
      const saved = localStorage.getItem('treinosSalvos')
      if (saved) {
        try {
          setTreinosSalvos(JSON.parse(saved))
        } catch {
          setTreinosSalvos([])
        }
      }
    }, [])

    return(
        <div>
            <h1>Lista de Treinos Montados</h1>
            {treinosSalvos.length === 0 ? (
              <p>Nenhum treino salvo ainda.</p>
            ) : (
              <div className="treinos-container">
                {treinosSalvos.map((treino, index) => (
                  <div key={index} className="treino-card">
                    <h3>{treino.nome}</h3>
                    <ul>
                      {treino.exercicios.map((ex, i) => <li key={i}>{ex}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}
        </div>
    )
}

export default TreinoAtual