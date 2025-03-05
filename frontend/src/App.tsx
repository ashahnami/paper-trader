import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import Stock from './pages/Stock';
import Settings from './pages/Settings';
import NotFound from './pages/404';
import { Layout, RequireAuth } from './components/Layout';
import './assets/base.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stock/:ticker" element={<Stock />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="*" element={<NotFound />} />        
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;