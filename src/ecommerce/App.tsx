import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';


const ProductListingPage = lazy(() => import('./pages/ProductListingPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));


function App() {
  return (
    <Routes>
        <Route path="/" element={<ProductListingPage />} />
        
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/checkout"
          element={
            <CheckoutPage />
          }
        />
        <Route
          path="/profile"
          element={
            <ProfilePage />
          }
        />
        <Route
          path="/order-history"
          element={
            <OrderHistoryPage />
          }
        />
    </Routes>
  );
}

export default App;
