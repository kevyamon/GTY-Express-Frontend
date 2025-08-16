import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const AuthGuard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // --- MODIFICATION : Logique simplifiée et corrigée ---
    // Le rôle du gardien est maintenant unique : si l'utilisateur est banni
    // et qu'il n'est pas sur la page de bannissement, on l'y envoie de force.
    if (userInfo?.status === 'banned' && location.pathname !== '/banned') {
      navigate('/banned', { replace: true });
    }
    // J'ai supprimé la condition 'else if' qui redirigeait l'utilisateur actif.
    // C'est maintenant le composant BannedScreen qui gérera la redirection
    // après le compte à rebours, comme tu le souhaites.
  }, [userInfo, navigate, location]);

  if (userInfo?.status === 'banned' && location.pathname !== '/banned') {
    return null; 
  }

  return <Outlet />;
};

export default AuthGuard;