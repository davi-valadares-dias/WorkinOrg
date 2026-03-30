import React, { useState, useEffect } from 'react';
import './styles.css';

function Cardio() {
  const [cardioType, setCardioType] = useState('');
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState('');
  const [distance, setDistance] = useState('');
  const [calories, setCalories] = useState(0);

  const cardioOptions = {
    'Corrida': { calPerKm: 0.75 },
    'Ciclismo': { calPerKm: 0.5 },
    'Natação': { calPerKm: 0.8 },
    'Caminhada': { calPerKm: 0.4 }
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const startStop = () => setIsRunning(!isRunning);

  const reset = () => {
    setTime(0);
    setIsRunning(false);
  };

  const calculateCalories = () => {
    if (cardioType && distance) {
      const calPerKm = cardioOptions[cardioType].calPerKm;
      const totalCal = distance * calPerKm;
      setCalories(totalCal);
    }
  };

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="cardio-container">
      <h1>Cardio</h1>
      <div className="cardio-selection">
        <h2>Escolha o Cardio</h2>
        <select value={cardioType} onChange={(e) => setCardioType(e.target.value)}>
          <option value="">Selecione</option>
          {Object.keys(cardioOptions).map(type => (
            <option key={type} value={type}>{type} - ~{cardioOptions[type].calPerKm} cal/km</option>
          ))}
        </select>
      </div>
      <div className="cronometro">
        <h2>Cronômetro</h2>
        <div className="time">{formatTime(time)}</div>
        <button onClick={startStop}>{isRunning ? 'Pausar' : 'Iniciar'}</button>
        <button onClick={reset}>Reset</button>
      </div>
      <div className="calculo">
        <h2>Cálculo de Calorias</h2>
        <input placeholder="Distância (km)" value={distance} onChange={(e) => setDistance(e.target.value)} />
        <button onClick={calculateCalories}>Calcular</button>
        <p>Calorias gastas: {calories.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default Cardio;