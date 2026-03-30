import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const MeusTreinos = () => {
  const [treinosSalvos, setTreinosSalvos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('treinosSalvos');
    if (saved) setTreinosSalvos(JSON.parse(saved));
  }, []);

  const editarTreino = (treino) => {
    localStorage.setItem('treinoMontado', JSON.stringify(treino.exercicios));
    navigate('/treino-montado');
  };

  return (
    <div className='meus-treinos-container'>
      <h1>Meus Treinos</h1>
      {treinosSalvos.length === 0 ? (
        <p>Nenhum treino salvo ainda.</p>
      ) : (
        <div className='treinos-list'>
          {treinosSalvos.map((treino, index) => (
            <div key={index} className='treino-card' onClick={() => editarTreino(treino)}>
              <h2>{treino.nome}</h2>
              <ul>
                {treino.exercicios.map((ex, i) => (
                  <li key={i}>
                    {typeof ex === 'string' ? ex : `${ex.exercicio} - ${ex.series} séries x ${ex.repeticoes} repetições`}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeusTreinos;