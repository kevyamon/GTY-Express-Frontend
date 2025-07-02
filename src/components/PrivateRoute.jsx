import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  // Si l'utilisateur est connecté, on affiche la page demandée (Outlet)
  // Sinon, on le redirige vers la page de connexion
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};
export default PrivateRoute;