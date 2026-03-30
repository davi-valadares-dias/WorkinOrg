import React, { useEffect, useState } from 'react';
import './styles.css';

function Historico() {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('historico');
    if (stored) setHistorico(JSON.parse(stored));
  }, []);

  return (
    <div className="historico-container">
      <h1>Histórico de Treinos</h1>
      <ul>
        {historico.map((t, i) => (
          <li key={i}>
            Treino {i+1} - {t.data} - Duração: {t.duracao}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Historico;