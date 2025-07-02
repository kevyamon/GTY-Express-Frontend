import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import ProductScreen from './screens/ProductScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import LandingScreen from './screens/LandingScreen.jsx';
import CartScreen from './screens/CartScreen.jsx'; // Importer la page Panier
import PrivateRoute from './components/PrivateRoute.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Route principale publique */}
      <Route index={true} path="/" element={<LandingScreen />} />

      {/* Autres routes publiques */}
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />

      {/* Routes Privées (nécessite d'être connecté) */}
      <Route path='' element={<PrivateRoute />}>
        <Route path="/products" element={<HomeScreen />} />
        <Route path='/cart' element={<CartScreen />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
