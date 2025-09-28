import React, { useMemo, useState } from 'react';
import {
    Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

import { countsBySeverity, matrixSpaceSeverity, coverageBySpace } from '../utils/aggregations';

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ReportCharts({ items, statuses }) {
    // local toggles for tables
    const [showTableSeverity, setShowTableSeverity] = useState(false);
    const [showTableSpaceSev, setShowTableSpaceSev] = useState(false);
    const [showTableCoverage, setShowTableCoverage] = useState(false);

    const severityAgg = useMemo(() => countsBySeverity(items, statuses), [items, statuses]);
    const severityLabels = ['Critical', 'High', 'Medium', 'Low'];
    const coveredArr = severityLabels.map(l => severityAgg[l]?.covered || 0);
    const totalArr = severityLabels.map(l => severityAgg[l]?.total || 0);
    const remainingArr = totalArr.map((t, i) => Math.max(0, t - coveredArr[i]));

    const severityChart = {
        labels: severityLabels,
        datasets: [
            { label: 'Covered', data: coveredArr },
            { label: 'Remaining', data: remainingArr },
        ],
    };

    const matrix = useMemo(() => matrixSpaceSeverity(items, statuses), [items, statuses]);
    const spaces = Object.keys(matrix).sort();
    const sevs = ['Critical', 'High', 'Medium', 'Low'];
    const spaceSevChart = {
        labels: spaces,
        datasets: sevs.map(s => ({ label: s, data: spaces.map(sp => matrix[sp][s] || 0), stack: 'sev' })),
    };

    const cov = useMemo(() => coverageBySpace(items, statuses), [items, statuses]);
    const covSpaces = Object.keys(cov).sort();
    const covPct = covSpaces.map(sp => {
        const { total, covered } = cov[sp];
        return total ? +(covered / total * 100).toFixed(1) : 100;
    });
    const coverageChart = {
        labels: covSpaces,
        datasets: [{ label: '% Covered', data: covPct }],
    };

    const commonOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } };
    const stackedOpts = { ...commonOpts, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } };

    return (
        <div className="row g-3">
            {/* Severity Coverage */}
            <div className="col-12 col-lg-4">
                <div className="card h-100">
                    <div className="card-header d-flex justify-content-between align-items-center bg-light">
                        <span>Severity Coverage</span>
                        <button
                            className="btn btn-link btn-sm"
                            aria-expanded={showTableSeverity}
                            aria-controls="severity-table"
                            onClick={() => setShowTableSeverity(v => !v)}
                        >
                            {showTableSeverity ? 'Hide data table' : 'Show data table'}
                        </button>
                    </div>
                    <div className="card-body" style={{ height: 320 }}>
                        <Doughnut aria-label="Covered vs remaining by severity" data={severityChart} options={commonOpts} />
                    </div>
                    {showTableSeverity && (
                        <div className="card-footer" id="severity-table">
                            <div className="table-responsive">
                                <table className="table table-sm mb-0">
                                    <thead className="table-light">
                                        <tr><th>Severity</th><th>Covered</th><th>Remaining</th><th>Total</th></tr>
                                    </thead>
                                    <tbody>
                                        {severityLabels.map((lab, i) => (
                                            <tr key={lab}>
                                                <td>{lab}</td>
                                                <td data-testid={`sev-covered-${lab}`}>{coveredArr[i]}</td>
                                                <td data-testid={`sev-remaining-${lab}`}>{remainingArr[i]}</td>
                                                <td data-testid={`sev-total-${lab}`}>{totalArr[i]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Space × Severity */}
            <div className="col-12 col-lg-8">
                <div className="card h-100">
                    <div className="card-header d-flex justify-content-between align-items-center bg-light">
                        <span>Space × Severity (counts)</span>
                        <button
                            className="btn btn-link btn-sm"
                            aria-expanded={showTableSpaceSev}
                            aria-controls="space-severity-table"
                            onClick={() => setShowTableSpaceSev(v => !v)}
                        >
                            {showTableSpaceSev ? 'Hide data table' : 'Show data table'}
                        </button>
                    </div>
                    <div className="card-body" style={{ height: 320 }}>
                        <Bar aria-label="Counts by space and severity" data={spaceSevChart} options={stackedOpts} />
                    </div>
                    {showTableSpaceSev && (
                        <div className="card-footer" id="space-severity-table">
                            <div className="table-responsive">
                                <table className="table table-sm mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Space</th>
                                            {sevs.map(s => <th key={s}>{s}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {spaces.map(sp => (
                                            <tr key={sp}>
                                                <td>{sp}</td>
                                                {sevs.map(s => (
                                                    <td key={s} data-testid={`space-${sp}-${s}`}>{matrix[sp][s] || 0}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* % Coverage by Space */}
            <div className="col-12">
                <div className="card h-100">
                    <div className="card-header d-flex justify-content-between align-items-center bg-light">
                        <span>% Coverage by Space</span>
                        <button
                            className="btn btn-link btn-sm"
                            aria-expanded={showTableCoverage}
                            aria-controls="coverage-space-table"
                            onClick={() => setShowTableCoverage(v => !v)}
                        >
                            {showTableCoverage ? 'Hide data table' : 'Show data table'}
                        </button>
                    </div>
                    <div className="card-body" style={{ height: 340 }}>
                        <Bar aria-label="Percent coverage by space" data={coverageChart}
                            options={{ ...commonOpts, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => `${v}%` } } } }} />
                    </div>
                    {showTableCoverage && (
                        <div className="card-footer" id="coverage-space-table">
                            <div className="table-responsive">
                                <table className="table table-sm mb-0">
                                    <thead className="table-light">
                                        <tr><th>Space</th><th>% Covered</th></tr>
                                    </thead>
                                    <tbody>
                                        {covSpaces.map((sp, i) => (
                                            <tr key={sp}>
                                                <td>{sp}</td>
                                                <td data-testid={`coverage-${sp}`}>{covPct[i]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
