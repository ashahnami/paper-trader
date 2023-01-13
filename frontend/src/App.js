import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Portfolio from './pages/Portfolio/Portfolio';
import RegisterPage from './pages/Login/RegisterPage';
import LoginPage from './pages/Login/LoginPage';
import Stock from './pages/Stock/Stock';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/stock/:ticker" element={<Stock />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;