import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Provider } from 'react-redux';
import store from './store.js';
import App from './App.jsx';

// Fichiers de style
import './index.css';
import './App.css';

// Écrans principaux
import LandingScreen from './screens/LandingScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import ProductScreen from './screens/ProductScreen.jsx';
import CartScreen from './screens/CartScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import FavoritesScreen from './screens/FavoritesScreen.jsx';
import ShippingScreen from './screens/ShippingScreen.jsx';
import PaymentScreen from './screens/PaymentScreen.jsx';
import PlaceOrderScreen from './screens/PlaceOrderScreen.jsx';
import OrderScreen from './screens/OrderScreen.jsx';
import PaymentGatewayScreen from './screens/PaymentGatewayScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import ProfileDetailsScreen from './screens/ProfileDetailsScreen.jsx';
import NotificationsScreen from './screens/NotificationsScreen.jsx';

// Composants de route
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

// Écrans Admin
import ProductListScreen from './screens/admin/ProductListScreen.jsx';
import OrderListScreen from './screens/admin/OrderListScreen.jsx';
import ProductEditScreen from './screens/admin/ProductEditScreen.jsx';
import PromotionListScreen from './screens/admin/PromotionListScreen.jsx'; // NOUVELLE PAGE

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* --- Routes Publiques --- */}
      <Route index={true} path="/" element={<LandingScreen />} />
      <Route path="/search/:keyword" element={<HomeScreen />} />
      <Route path="/supermarket" element={<HomeScreen />} />
      <Route path="/supermarket/search/:keyword" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />

      {/* --- Routes Privées (clients et admins connectés) --- */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/profile-details" element={<ProfileDetailsScreen />} />
        <Route path="/products" element={<HomeScreen />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/favorites" element={<FavoritesScreen />} />
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/order/:id" element={<OrderScreen />} />
        <Route path="/payment-gateway/:id" element={<PaymentGatewayScreen />} />
        <Route path="/notifications" element={<NotificationsScreen />} />
      </Route>

      {/* --- Routes Admin (uniquement admins connectés) --- */}
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/productlist" element={<ProductListScreen />} />
        <Route path="/admin/orderlist" element={<OrderListScreen />} />
        <Route path="/admin/promotionlist" element={<PromotionListScreen />} /> {/* NOUVELLE ROUTE */}
        <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);