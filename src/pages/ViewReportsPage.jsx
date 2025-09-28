import React, { useMemo } from 'react';

import { listReports } from '../utils/api';

export default function ViewReportsPage() {
  const reports = useMemo(() => listReports(), []);
  if (!reports.length) return <div className="alert alert-secondary">No reports saved.</div>;

  return (
    <div className="card">
      <div className="card-header bg-light">Saved Reports</div>
      <div className="card-body p-0">
        <table className="table table-sm align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Report ID</th>
              <th>Building</th>
              <th>Date</th>
              <th>Items</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id}>
                <td className="text-monospace">{r.id}</td>
                <td>{r.buildingName}</td>
                <td>{r.createdAt?.slice(0,10)}</td>
                <td>{r.itemCount}</td>
                <td><span className="badge text-bg-secondary">{r.status || 'Draft'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
