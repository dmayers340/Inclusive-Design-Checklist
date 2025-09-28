import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ChecklistProvider } from './context/ChecklistContext';
import CreateReportPage from './pages/CreateReportPage';
import ViewReportsPage from './pages/ViewReportsPage';
import HomePage from './pages/HomePage';
// Bootstrap (CSS only is fine)
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChecklistProvider initialItems={[]}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateReportPage />} />
          <Route path="/reports" element={<ViewReportsPage />} />
        </Routes>
      </BrowserRouter>
    </ChecklistProvider>
  </React.StrictMode>
);
