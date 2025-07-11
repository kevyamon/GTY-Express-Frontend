// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { HelmetProvider } from 'react-helmet-async';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
import App from './App';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import OrderListScreen from './screens/admin/OrderListScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import SupermarketScreen from './screens/SupermarketScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import SearchScreen from './screens/SearchScreen';
import ProfileDetailsScreen from './screens/ProfileDetailsScreen';
import NotificationScreen from './screens/NotificationScreen';
import PromotionListScreen from './screens/admin/PromotionListScreen';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <HelmetProvider>
      <BrowserRouter>
        <PayPalScriptProvider deferLoading={true}>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index={true} path="/" element={<HomeScreen />} />
              <Route path="/search/:keyword" element={<SearchScreen />} />
              <Route path="/product/:id" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/supermarket" element={<SupermarketScreen />} />
              <Route path="/favorites" element={<FavoritesScreen />} />
              <Route path="/notifications" element={<NotificationScreen />} />
              <Route path="/products" element={<HomeScreen />} />
              <Route path="/profile-details" element={<ProfileDetailsScreen />} />
              
              <Route path="" element={<PrivateRoute />}>
                <Route path="/profile" element={<ProfileScreen />} />
              </Route>

              <Route path="" element={<AdminRoute />}>
                <Route path="/admin/orderlist" element={<OrderListScreen />} />
                <Route path="/admin/productlist" element={<ProductListScreen />} />
                <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
                <Route path="/admin/promotionlist" element={<PromotionListScreen />} />
              </Route>
            </Route>
          </Routes>
        </PayPalScriptProvider>
      </BrowserRouter>
    </HelmetProvider>
  </Provider>
);