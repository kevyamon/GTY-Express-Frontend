import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  // On vérifie si l'utilisateur est connecté ET s'il est admin
  return userInfo && userInfo.isAdmin ? (
    <Outlet /> // Si oui, on affiche la page demandée
  ) : (
    <Navigate to='/login' replace /> // Sinon, on le redirige
  );
};
export default AdminRoute;
