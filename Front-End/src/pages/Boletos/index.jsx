import React, { useEffect, useState } from 'react';
import './styles.css';

function Boletos() {
  const [boletos, setBoletos] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('boletos');
    if (stored) setBoletos(JSON.parse(stored));
  }, []);

  return (
    <div className="boletos-container">
      <h1>Meus Boletos</h1>
      <ul>
        {boletos.map(b => (
          <li key={b.id}>
            Boleto {b.id} - R$ {b.valor} - Vencimento: {b.vencimento}
            <button>Pagar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Boletos;