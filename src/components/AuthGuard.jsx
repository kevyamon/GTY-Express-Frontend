import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

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
      // On le renvoie à la page d'accueil des produits pour qu'il puisse continuer sa navigation
      navigate('/products', { replace: true });
    }
  }, [userInfo, navigate, location]);

  // Si l'utilisateur est banni, on n'affiche que la page de bannissement (gérée par la redirection ci-dessus).
  // On empêche le reste du site (l'Outlet) de s'afficher pour ne pas qu'il voie les menus, etc.
  if (userInfo?.status === 'banned') {
    return <Outlet />;
  }

  // Si tout va bien, on affiche la page demandée.
  return <Outlet />;
};

export default AuthGuard;