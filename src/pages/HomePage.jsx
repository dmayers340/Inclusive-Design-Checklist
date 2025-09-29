import React, { useMemo } from 'react';

import { listReports } from '../utils/api';
import NavBar from '../components/NavBar';
export default function HomePage() {
  const reports = useMemo(() => listReports(), []);
  return (
    <>
      <NavBar />
      <div className="row g-3">
        <div className="col-12">
          <h1 className="h4 mb-3">Welcome! Create an Inclusive Design Checklist Report</h1>
          <p className="text-muted">
            Use <strong><a href="/create">Create New Report</a></strong> to start a review
          </p>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-body">
              <h2 className="h6 mb-3">Recent Reports</h2>
              {reports.length === 0 ? (
                <div className="text-muted">No reports saved yet.</div>
              ) : (
                <ul className="list-group">
                  {reports.slice(0, 5).map(r => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={r.id}>
                      <span>
                        <strong>{r.buildingName}</strong> — {r.createdAt?.slice(0, 10)} (items: {r.itemCount})
                      </span>
                      <span className="badge bg-secondary">{r.status || 'Draft'}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-body">
              <h2 className="h6 mb-3">Resources used for this project:</h2>
              <ul>
                <li>
                  <a href="https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/msc/documents/presentations/A11Y/PDF/Accessible-Inclusive-Workplace-Handbook.pdf">Microsoft: The Accessible and Inclusive Workplace Handbook</a>
                </li>
                <li>
                  <a href="https://www.nyc.gov/html/ddc/downloads/pdf/udny/udny2.pdf">Universal Design New York</a>
                </li>
                <li>
                  <a href="https://about.starbucks.com/uploads/2024/02/Starbucks-Inclusive-Spaces-Checklist.pdf">Starbucks Inclusive Spaces Retail Checklist</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
