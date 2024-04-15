import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Dashboard from './pages/dashboard';
import RegisterPage from './pages/register';
import LoginPage from './pages/login';
import Stock from './pages/stock';
import Settings from './pages/settings';
import NotFound from './pages/404';
import PrivateRoutes from './utils/PrivateRoutes';
import './assets/base.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Dashboard />} />
          <Route path="/stock/:ticker" element={<Stock />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;