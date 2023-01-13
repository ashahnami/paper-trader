import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Portfolio from './pages/Portfolio/Portfolio';
import RegisterPage from './pages/Login/RegisterPage';
import LoginPage from './pages/Login/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;