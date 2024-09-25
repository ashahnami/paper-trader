import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Register from './pages/Register';
import Login from './pages/Login';
import Stock from './pages/Stock';
import Settings from './pages/Settings';
import NotFound from './pages/404';
import RequireAuth from './utils/RequireAuth';
import './assets/base.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/stock/:ticker" element={<Stock />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;