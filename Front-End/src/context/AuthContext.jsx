import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAutenticado, setIsAutenticado] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Verificar sessão ao carregar
  useEffect(() => {
    const verificarSessao = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:3000/api/auth/verificar-sessao', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.tipo === 'usuario') {
              setUsuario(data.usuario);
            } else if (data.tipo === 'admin') {
              setAdmin(data.admin);
            }
            setIsAutenticado(true);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Erro ao verificar sessão:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    verificarSessao();
  }, [token]);

  const loginAdmin = useCallback(async (email, senha) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao fazer login');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setAdmin(data.admin);
      setIsAutenticado(true);

      return { sucesso: true, admin: data.admin };
    } catch (error) {
      return { sucesso: false, erro: error.message };
    }
  }, []);

  const loginUsuario = useCallback(async (email, senha) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao fazer login');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUsuario(data.usuario);
      setIsAutenticado(true);

      return { sucesso: true, usuario: data.usuario };
    } catch (error) {
      return { sucesso: false, erro: error.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await fetch('http://localhost:3000/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }

    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
    setAdmin(null);
    setIsAutenticado(false);
  }, [token]);

  const value = {
    usuario,
    admin,
    loading,
    isAutenticado,
    token,
    loginAdmin,
    loginUsuario,
    logout,
    isAdmin: !!admin,
    isUsuario: !!usuario
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
