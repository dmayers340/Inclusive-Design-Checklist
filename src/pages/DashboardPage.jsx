import React, { useMemo, useState, useEffect } from 'react';

import { listReports, getReport } from '../utils/api';
import { computeScore } from '../utils/scoring';
import ReportCharts from '../components/ReportCharts';

export default function DashboardPage() {
  const [reports, setReports] = useState([]);
  const [reportId, setReportId] = useState('');
  const [report, setReport] = useState(null);

  useEffect(() => { setReports(listReports()); }, []);
  useEffect(() => { if (!reportId && reports.length) setReportId(reports[0].id); }, [reports, reportId]);
  useEffect(() => { if (reportId) setReport(getReport(reportId)); }, [reportId]);

  const score = useMemo(() => report ? computeScore(report.items, report.statuses) : null, [report]);
  if (!reports.length) return <div className="alert alert-secondary">No saved reports yet.</div>;
  if (!report) return <div className="alert alert-secondary">Select a report.</div>;

  return (
    <div className="vstack gap-3">
      <div className="d-flex align-items-end gap-3">
        <div className="flex-grow-1">
          <label className="form-label">Report
            <select className="form-select" value={reportId} onChange={(e) => setReportId(e.target.value)}>
              {reports.map(r => <option key={r.id} value={r.id}>{r.buildingName} — {r.createdAt?.slice(0, 10)}</option>)}
            </select>
          </label>
        </div>
      </div>

      {/* Top metrics (existing) */}
      <div className="row g-3">
        <div className="col-12 col-md-3">
          <MetricCard title="Weighted Coverage %" value={(score.coveragePct * 100).toFixed(1) + '%'} subtitle={`${score.coveragePoints} / ${score.totalWeight}`} />
        </div>
        <div className="col-12 col-md-3">
          <MetricCard title="Weighted Achievement %" value={(score.achievementPct * 100).toFixed(1) + '%'} subtitle={`${score.achievementPoints} / ${3 * score.totalWeight}`} />
        </div>
        <div className="col-12 col-md-3">
          <MetricCard title="Critical Items Met?" value={score.critAllMet ? 'YES' : 'NO'} subtitle="All Critical must be covered" />
        </div>
        <div className="col-12 col-md-3">
          <MetricCard
            title="Tier"
            value={score.passes.gold ? 'GOLD' : score.passes.silver ? 'SILVER' : score.passes.bronze ? 'BRONZE' : 'NOT MET'}
            subtitle={`High ${(score.highPct * 100).toFixed(0)}% | High+Med ${(score.hiMedPct * 100).toFixed(0)}%`}
          />
        </div>
      </div>

      {/* New charts */}
      <ReportCharts items={report.items} statuses={report.statuses} />
    </div>
  );
}

function MetricCard({ title, value, subtitle }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="text-muted text-uppercase small mb-1">{title}</div>
        <div className="h3 mb-0">{value}</div>
        {subtitle && <div className="text-muted small">{subtitle}</div>}
      </div>
    </div>
  );
}