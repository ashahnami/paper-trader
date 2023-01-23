import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/dashboard/Dashboard';
import RegisterPage from './pages/Register/RegisterPage';
import LoginPage from './pages/Login/LoginPage';
import Stock from './pages/Stock/Stock';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/stock/:ticker" element={<Stock />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;