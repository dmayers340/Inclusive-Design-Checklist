import React, { useMemo } from 'react';

import { listReports } from '../utils/api';

export default function HomePage() {
  const reports = useMemo(() => listReports(), []);
  return (
    <div className="row g-3">
      <div className="col-12">
        <h1 className="h4 mb-3">Welcome! Create an Inclusive Design Checklist Report</h1>
        <p className="text-muted">
          Use <strong>Create New Report</strong> to start a review, or jump to <strong>Dashboard</strong> to view charts for your current work.
        </p>
      </div>

      <div className="col-12 col-lg-6">
        <div className="card">
          <div className="card-body">
            <h3 className="h6 mb-3">Recent Reports</h3>
            {reports.length === 0 ? (
              <div className="text-muted">No reports saved yet.</div>
            ) : (
              <ul className="list-group">
                {reports.slice(0,5).map(r => (
                  <li className="list-group-item d-flex justify-content-between align-items-center" key={r.id}>
                    <span>
                      <strong>{r.buildingName}</strong> — {r.createdAt?.slice(0,10)} (items: {r.itemCount})
                    </span>
                    <span className="badge bg-secondary">{r.status || 'Draft'}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
