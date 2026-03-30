import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './styles.css';

function DefinirSeries() {
  const [treino, setTreino] = useState([]);
  const [series, setSeries] = useState({});
  const [repeticoes, setRepeticoes] = useState({});
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const { usuarioId, usuarioNome, nomeTreino } = location.state || {};

  useEffect(() => {
    const stored = localStorage.getItem('treinoSelecionado');
    if (stored) setTreino(JSON.parse(stored));
  }, []);

  const handleSeriesChange = (ex, val) => {
    setSeries({ ...series, [ex]: val });
  };

  const handleRepeticoesChange = (ex, val) => {
    setRepeticoes({ ...repeticoes, [ex]: val });
  };

  const salvar = async () => {
    const treinoComDetalhes = treino.map(ex => ({
      nome: ex.nome || ex,
      series: series[ex.nome || ex] || 3,
      repeticoes: repeticoes[ex.nome || ex] || 10
    }));

    setCarregando(true);
    try {
      const payload = {
        nome: nomeTreino || 'Novo Treino',
        exercicios: treinoComDetalhes,
      };
      if (usuarioId) payload.paraUsuarioId = usuarioId;

      const response = await fetch('http://localhost:3000/api/treinos/criar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('✅ Treino criado e salvo no sistema!');
        navigate(usuarioId ? '/admin' : '/meus-treinos');
      } else {
        alert('❌ Erro ao criar treino');
      }
    } catch (erro) {
      alert('Erro ao conectar com servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="definir-container">
      <h1>Definir Séries e Repetições</h1>
      {treino.map((ex, i) => {
        const nome = ex.nome || ex;
        return (
          <div key={i} className="exercicio-item">
            <h3>{nome}</h3>
            <label>Séries: <input type="number" min="1" value={series[nome] || 3} onChange={(e) => handleSeriesChange(nome, e.target.value)} /></label>
            <label>Repetições: <input type="number" min="1" value={repeticoes[nome] || 10} onChange={(e) => handleRepeticoesChange(nome, e.target.value)} /></label>
          </div>
        );
      })}
      <button onClick={salvar} disabled={carregando}>{carregando ? '⏳ Salvando...' : 'Salvar Treino no Banco de Dados'}</button>
    </div>
  );
}

export default DefinirSeries;