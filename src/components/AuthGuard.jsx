import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

// Ce composant "entoure" les autres et vérifie le statut de l'utilisateur
const AuthGuard = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Si l'utilisateur est banni et n'est pas déjà sur la page de bannissement
    if (userInfo?.status === 'banned' && location.pathname !== '/banned') {
      navigate('/banned', { replace: true });
    }
    // Si l'utilisateur n'est pas banni mais se trouve sur la page de bannissement
    else if (userInfo?.status === 'active' && location.pathname === '/banned') {
      navigate('/', { replace: true });
    }
  }, [userInfo, navigate, location]);

  return children; // Affiche la page demandée si tout va bien
};

export default AuthGuard;