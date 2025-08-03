import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom'; // Outlet a été ajouté

// Ce composant "entoure" les autres et vérifie le statut de l'utilisateur
const AuthGuard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Si l'utilisateur est banni et n'est pas déjà sur la page de bannissement
    if (userInfo?.status === 'banned' && location.pathname !== '/banned') {
      navigate('/banned', { replace: true });
    }
    // Si l'utilisateur est réactivé et se trouve toujours sur la page de bannissement
    else if (userInfo?.status === 'active' && location.pathname === '/banned') {
      navigate('/', { replace: true });
    }
  }, [userInfo, navigate, location]);

  // On affiche la page demandée si tout va bien
  return <Outlet />; // Modifié ici, "children" a été remplacé par <Outlet />
};

export default AuthGuard;