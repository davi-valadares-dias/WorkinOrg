import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RotaProtegida({ children, requerAdmin = false }) {
  const { isAutenticado, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!isAutenticado) {
    return <Navigate to="/login" />;
  }

  if (requerAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
}
