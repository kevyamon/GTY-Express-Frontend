import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

// Ce composant "entoure" les autres et vérifie le statut de l'utilisateur
const AuthGuard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // COMMENTAIRE : Ce 'useEffect' est le coeur du système. Il s'exécute à chaque changement
    // de 'userInfo' (par exemple, après une mise à jour via WebSocket) ou de page.

    // --- CONDITION 1 : L'UTILISATEUR EST BANNI ---
    // Si l'utilisateur est banni et n'est pas déjà sur la page de bannissement...
    if (userInfo?.status === 'banned' && location.pathname !== '/banned') {
      // ...on le redirige de force vers la page de bannissement. C'est l'effet "boom !".
      navigate('/banned', { replace: true });
    }
    // --- CONDITION 2 : L'UTILISATEUR EST RÉACTIVÉ ---
    // S'il est de nouveau actif mais se trouve toujours sur la page de bannissement...
    else if (userInfo?.status === 'active' && location.pathname === '/banned') {
      // ...on le renvoie sur la page principale des produits pour qu'il puisse reprendre sa navigation.
      navigate('/products', { replace: true });
    }
  }, [userInfo, navigate, location]);

  // Si l'utilisateur est banni, on n'affiche rien d'autre que la page de bannissement 
  // (qui est gérée par la redirection ci-dessus). On bloque l'affichage du reste du site.
  if (userInfo?.status === 'banned' && location.pathname !== '/banned') {
    return null; // Affiche une page blanche le temps de la redirection.
  }

  // Si tout va bien (statut "active"), on affiche la page demandée normalement.
  return <Outlet />;
};

export default AuthGuard;