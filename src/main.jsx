import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ChecklistProvider } from './context/ChecklistContext';
import CreateReportPage from './pages/CreateReportPage';

// Bootstrap (CSS only is fine)
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChecklistProvider initialItems={[]}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/create" replace />} />
          <Route path="/create" element={<CreateReportPage />} />
        </Routes>
      </BrowserRouter>
    </ChecklistProvider>
  </React.StrictMode>
);
