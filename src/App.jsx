import React from 'react';
import { Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import CreateReportPage from './pages/CreateReportPage';
import DashboardPage from './pages/DashboardPage';
import ViewReportsPage from './pages/ViewReportsPage';

export default function App() {
  // optional global state here if you want
  return (
    <div className="min-vh-100 d-flex flex-column">
      <NavBar />
      <main className="container mb-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateReportPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/reports" element={<ViewReportsPage />} />
        </Routes>
      </main>
    </div>
  );
}
