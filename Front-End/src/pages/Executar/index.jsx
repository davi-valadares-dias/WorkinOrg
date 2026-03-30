import React, { useState, useEffect } from 'react';
import './styles.css';
import { exercicios } from '../../data/exercicios.js';
import { useAuth } from '../../context/AuthContext';

function Executar() {
  const [treinos, setTreinos] = useState([]);
  const [selectedTreino, setSelectedTreino] = useState(null);
  const [currentEx, setCurrentEx] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [pesos, setPesos] = useState({});
  const [feitos, setFeitos] = useState({});
  const [videoModal, setVideoModal] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    // Busca os treinos do BANCO DE DADOS, criados tanto pelo admin quanto usuário
    fetch('http://localhost:3000/api/treinos/meus-treinos', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTreinos(data.treinos || []))
      .catch(err => console.error(err));
  }, [token]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const startTreino = () => {
    if (selectedTreino) {
      setIsRunning(true);
    }
  };

  const nextEx = () => {
    if (currentEx < selectedTreino.exercicios.length - 1) {
      setCurrentEx(currentEx + 1);
    }
  };

  const markDone = (exIndex) => {
    setFeitos({ ...feitos, [exIndex]: true });
  };

  const finishTreino = async () => {
    // Pega os pesos digitados e monta o objeto para o histórico
    const exerciciosExecutados = selectedTreino.exercicios.map((ex, i) => {
      const seriePesos = [];
      for(let s=0; s<ex.series; s++){
        seriePesos.push(`${pesos[`${i}-${s}`] || 0}kg`);
      }
      return {
        nome: ex.nome || ex.exercicio,
        observacao: `Séries/Pesos: ${seriePesos.join(' | ')}`
      };
    });

    try {
      const res = await fetch(`http://localhost:3000/api/treinos/${selectedTreino._id}/executar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          duracao: time,
          concluidoPercentual: 100,
          exercicios: exerciciosExecutados
        })
      });
      if(res.ok) {
        alert('✅ Treino finalizado e salvo no histórico oficial!');
      }
    } catch (err) {
      console.error(err);
    }

    setIsRunning(false);
    setTime(0);
    setSelectedTreino(null);
    setCurrentEx(0);
    setPesos({});
    setFeitos({});
  };

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}:${s < 10 ? '0' : ''}${s}`;
  };

  // Função para buscar o videoUrl de um exercício
  const getVideoUrl = (exercicioNome) => {
    for (const grupo of Object.values(exercicios)) {
      const ex = grupo.find(e => e.nome === exercicioNome);
      if (ex && ex.videoUrl) return ex.videoUrl;
    }
    return null;
  };

  return (
    <div className="executar-container">
      <h1>Executar Treino</h1>
      {!selectedTreino ? (
        <div>
          <h2>Escolha um Treino</h2>
          {treinos.map((t, i) => (
            <button key={i} onClick={() => setSelectedTreino(t)}>{t.nome}</button>
          ))}
        </div>
      ) : (
        <div>
          <h2>{selectedTreino.nome}</h2>
          <div className="timer">Tempo: {formatTime(time)}</div>
          {!isRunning ? (
            <button onClick={startTreino}>Iniciar Treino</button>
          ) : (
            <div>
              <div className="exercicio-card">
                <h3>{selectedTreino.exercicios[currentEx].nome || selectedTreino.exercicios[currentEx].exercicio}</h3>
                <p>Séries: {selectedTreino.exercicios[currentEx].series}</p>
                <p>Repetições: {selectedTreino.exercicios[currentEx].repeticoes}</p>
                
                {/* Botão de vídeo */}
                {getVideoUrl(selectedTreino.exercicios[currentEx].nome || selectedTreino.exercicios[currentEx].exercicio) && (
                  <button 
                    className="btn-ver-video"
                    onClick={() => setVideoModal({
                      nome: selectedTreino.exercicios[currentEx].nome || selectedTreino.exercicios[currentEx].exercicio,
                      url: getVideoUrl(selectedTreino.exercicios[currentEx].nome || selectedTreino.exercicios[currentEx].exercicio)
                    })}
                  >
                    📹 Ver técnica correta
                  </button>
                )}
                
                <div className="pesos">
                  {Array.from({ length: selectedTreino.exercicios[currentEx].series }, (_, i) => (
                    <input
                      key={i}
                      placeholder={`Peso série ${i+1}`}
                      value={pesos[`${currentEx}-${i}`] || ''}
                      onChange={(e) => setPesos({ ...pesos, [`${currentEx}-${i}`]: e.target.value })}
                    />
                  ))}
                </div>
                {!feitos[currentEx] ? (
                  <button onClick={() => markDone(currentEx)}>Marcar como Feito</button>
                ) : (
                  <p>Feito!</p>
                )}
              </div>
              {currentEx < selectedTreino.exercicios.length - 1 ? (
                <button onClick={nextEx}>Próximo Exercício</button>
              ) : (
                <button onClick={finishTreino}>Finalizar Treino</button>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODAL DE VÍDEO */}
      {videoModal && (
        <div className="modal-video-overlay" onClick={() => setVideoModal(null)}>
          <div className="modal-video-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-video-header">
              <h2>📹 {videoModal.nome}</h2>
              <button className="btn-fechar-modal" onClick={() => setVideoModal(null)}>✕</button>
            </div>
            <div className="modal-video-player">
              <iframe
                width="100%"
                height="500"
                src={videoModal.url}
                title={videoModal.nome}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Executar;