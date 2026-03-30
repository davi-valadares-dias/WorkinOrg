import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './styles.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const { loginAdmin, loginUsuario, isAutenticado, isAdmin } = useAuth();

  // Redirecionar se já autenticado
  useEffect(() => {
    if (isAutenticado) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAutenticado, isAdmin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      // Tenta primeiro como admin
      let resultado = await loginAdmin(email, senha);

      // Se falhar, tenta como usuário
      if (!resultado.sucesso) {
        resultado = await loginUsuario(email, senha);
      }

      if (resultado.sucesso) {
        // O sistema já sabe se é admin ou usuário pelo Context
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setErro(resultado.erro || 'Email ou senha incorretos');
      }
    } catch (error) {
      setErro('Erro ao conectar com o servidor');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>WORKORG</h1>
        <p className="subtitle">🏋️ Sistema de Academia</p>
        
        {erro && <div className="erro-msg">{erro}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              placeholder="📧 Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <div className="input-senha-wrapper">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="🔐 Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn-toggle-senha"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                title={mostrarSenha ? 'Esconder senha' : 'Mostrar senha'}
              >
                {mostrarSenha ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={carregando} className="btn-login">
            {carregando ? '⏳ Conectando...' : '✓ ENTRAR'}
          </button>
        </form>

        <div className="info-demo">
          <p>👤 <strong>Demo Admin:</strong> admin@workinorg.com / admin123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;