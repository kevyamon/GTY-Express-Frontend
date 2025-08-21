import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
// --- MODIFICATION : On importe useOutletContext ---
import { useNavigate, useLocation, Outlet, useOutletContext } from 'react-router-dom';

const AuthGuard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  
  // --- AJOUT : On récupère le contexte passé par App.jsx ---
  const context = useOutletContext();

  useEffect(() => {
    if (userInfo?.status === 'banned' && location.pathname !== '/banned') {
      navigate('/banned', { replace: true });
    }
  }, [userInfo, navigate, location]);

  if (userInfo?.status === 'banned' && location.pathname !== '/banned') {
    return null; 
  }

  // --- MODIFICATION : On passe le contexte à l'Outlet enfant ---
  return <Outlet context={context} />;
};

export default AuthGuard;