import React, { useEffect, useState } from 'react';
import './styles.css';

function Progresso() {
  const [medidas, setMedidas] = useState({ peso: '', altura: '', imc: '' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setMedidas({
      peso: user.peso || '',
      altura: user.altura || '',
      imc: user.peso && user.altura ? (user.peso / ((user.altura/100)**2)).toFixed(2) : ''
    });
  }, []);

  return (
    <div className="progresso-container">
      <h1>Meu Progresso</h1>
      <div className="medidas">
        <p>Peso: {medidas.peso} kg</p>
        <p>Altura: {medidas.altura} cm</p>
        <p>IMC: {medidas.imc}</p>
      </div>
      <div className="grafico">
        {/* Placeholder para gráfico */}
        <p>Gráfico de progresso aqui</p>
      </div>
    </div>
  );
}

export default Progresso;