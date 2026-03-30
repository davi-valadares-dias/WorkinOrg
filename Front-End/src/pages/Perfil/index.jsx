import React, { useEffect, useState } from 'react';
import './styles.css';

function Perfil() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setUser(user);
  }, []);

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="foto">
          <img src="https://via.placeholder.com/150" alt="Foto do usuário" />
        </div>
        <h1>{user.nome || 'Nome'}</h1>
        <p>Idade: {user.idade || 'N/A'}</p>
        <p>Sexo: {user.sexo || 'N/A'}</p>
        <p>Peso: {user.peso || 'N/A'} kg</p>
        <p>Altura: {user.altura || 'N/A'} cm</p>
      </div>
    </div>
  );
}

export default Perfil;