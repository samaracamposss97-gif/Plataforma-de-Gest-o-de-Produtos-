import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ProductBoard from './pages/ProductBoard';
import ProductBuilder from './pages/ProductBuilder';
import EvidenceRepository from './pages/EvidenceRepository';
import ProductEvolution from './pages/ProductEvolution';
import OracleChat from './components/OracleChat';
import ApoioEscrita from './pages/ApoioEscrita';
import DashboardFinanceiro from './pages/DashboardFinanceiro';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app-container">
      <Sidebar onLogout={() => setIsAuthenticated(false)} />
      <main className="main-content">
        <OracleChat />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard-financeiro" element={<DashboardFinanceiro />} />
          <Route path="/produtos" element={<ProductBoard />} />
          <Route path="/produtos/:id" element={<ProductBuilder />} />
          <Route path="/evolucao" element={<ProductEvolution />} />
          <Route path="/evidencias" element={<EvidenceRepository />} />
          <Route path="/apoio-escrita" element={<ApoioEscrita />} />
        </Routes>
      </main>

    </div>
  );
}

export default App;
