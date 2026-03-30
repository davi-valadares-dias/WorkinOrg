import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { useAuth } from '../../context/AuthContext';

const Treinos = () => {
  const [ultimoTreino, setUltimoTreino] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    // Busca o último treino REAL do backend
    if (token) {
      fetch('http://localhost:3000/api/treinos/historico?limite=1', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.historico && data.historico.length > 0) {
            setUltimoTreino(data.historico[0]);
          }
        })
        .catch(err => console.error("Erro ao buscar histórico:", err));
    }
  }, [token]);

  useEffect(() => {
    fetch('http://localhost:3000/')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Falha na API: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Dados recebidos do Back-end:", data);
      })
      .catch(err => {
        console.error("Erro no fetch do back-end:", err);
      });
  }, []);

  return (
    <div className='treinos-container'>
      <h1>Menu Principal</h1>

      <div className='main-menu-cards'>
        <div className='main-card' onClick={() => navigate('/historico')}>
          <h2>Último Treino</h2>
          {ultimoTreino ? (
            <p>{ultimoTreino.treino?.nome || 'Treino'} - {new Date(ultimoTreino.dataExecucao).toLocaleDateString()}</p>
          ) : (
            <p>Nenhum treino no Histórico</p>
          )}
        </div>
        <div className='main-card' onClick={() => navigate('/boletos')}>
          <h2>Boletos</h2>
          <p>Ver seus boletos pendentes</p>
        </div>
        <div className='main-card' onClick={() => navigate('/progresso')}>
          <h2>Progresso</h2>
          <p>Acompanhe suas medidas e evolução</p>
        </div>
        <div className='main-card' onClick={() => navigate('/perfil')}>
          <h2>Perfil</h2>
          <p>Veja suas informações pessoais</p>
        </div>
      </div>
    </div>
  );
};

export default Treinos;