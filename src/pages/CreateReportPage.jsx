// src/pages/CreateReportPage.jsx
import React, { useEffect, useMemo, useState } from 'react';

import Sections from '../components/Sections';
import { useChecklist } from '../context/ChecklistContext';
import { loadBuildings, loadChecklist, saveReport } from '../utils/api';

// Optional: small helper to compute quick stats for the header
function useQuickStats(items, statuses) {
  return useMemo(() => {
    let total = items.length, na = 0, covered = 0, remaining = 0;
    for (const it of items) {
      const st = statuses[it.ID] || 'Not evaluated';
      if (st === 'Not applicable') na += 1;
      else if (st === 'Bronze' || st === 'Silver' || st === 'Gold') covered += 1;
      else remaining += 1;
    }
    return { total, na, covered, remaining };
  }, [items, statuses]);
}

export default function CreateReportPage() {
  const { items, setItems, status } = useChecklist();

  // Building selection
  const [buildings, setBuildings] = useState([]);
  const [buildingId, setBuildingId] = useState('');
  const [loadingBuildings, setLoadingBuildings] = useState(false);

  // Checklist loading states
  const [loadingChecklist, setLoadingChecklist] = useState(false);
  const [sourceLabel, setSourceLabel] = useState('inputs/inclusive_checklist.json');
  const [error, setError] = useState('');

  const stats = useQuickStats(items, status);

  // Load buildings on mount
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoadingBuildings(true);
        const list = await loadBuildings();
        if (!ignore) setBuildings(list || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) setLoadingBuildings(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  // Load checklist from /public/inputs by default
  const handleLoadChecklist = async () => {
    setError('');
    try {
      setLoadingChecklist(true);
      const data = await loadChecklist(); // fetch('/inputs/inclusive_checklist.json')
      if (!Array.isArray(data) || data.length === 0) {
        setError('Checklist file is empty or invalid.');
        return;
      }
      setItems(data);
      setSourceLabel('inputs/inclusive_checklist.json');
    } catch (e) {
      console.error(e);
      setError('Failed to load checklist.');
    } finally {
      setLoadingChecklist(false);
    }
  };

  // Optional: allow user to upload a custom JSON
  const handleUploadChecklist = async (file) => {
    setError('');
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      if (!Array.isArray(json)) throw new Error('JSON root must be an array.');
      setItems(json);
      setSourceLabel(file.name);
    } catch (e) {
      console.error(e);
      setError('Invalid JSON file.');
    }
  };

  const onFilePick = (e) => {
    const f = e.target.files?.[0];
    if (f) handleUploadChecklist(f);
    // reset so selecting the same file again re-triggers change
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!buildingId) {
      alert('Please select a building before saving.');
      return;
    }
    const building = buildings.find(b => String(b.id) === String(buildingId));
    const report = {
      id: `REP-${Date.now()}`,
      buildingId,
      buildingName: building?.name || String(buildingId),
      createdAt: new Date().toISOString(),
      status: 'Draft',
      itemCount: items.length,
      items,
      statuses: status,
      source: sourceLabel,
    };
    try {
      await saveReport(report); // persists to localStorage or your API
      alert('Report saved.');
    } catch (e) {
      console.error(e);
      alert('Failed to save report.');
    }
  };

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 m-0">Create New Report</h1>
        <div className="text-muted small">
          Source: <code>{sourceLabel}</code>
        </div>
      </div>

      {/* Stepper (optional visual) */}
      <nav aria-label="progress" className="mb-3">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item active" aria-current="page">Step 1: Sections</li>
          <li className="breadcrumb-item">Step 2: QA & Filters</li>
          <li className="breadcrumb-item">Step 3: Review & Save</li>
        </ol>
      </nav>

      {/* Controls Row */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            {/* Building selector */}
            <div className="col-12 col-md-4">
              <label className="form-label" htmlFor="buildingSelect">Building</label>
              <select
                id="buildingSelect"
                className="form-select"
                disabled={loadingBuildings}
                value={buildingId}
                onChange={(e) => setBuildingId(e.target.value)}
              >
                <option value="">Select a building…</option>
                {buildings.map(b => (
                  <option key={b.id} value={b.id}>{b.name ?? b.id}</option>
                ))}
              </select>
              {loadingBuildings && <div className="form-text">Loading buildings…</div>}
            </div>

            {/* Checklist source actions */}
            <div className="col-12 col-md-5">
              <p className="form-label">Checklist Source</p>
              <div className="d-flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleLoadChecklist}
                  disabled={loadingChecklist}
                >
                  {loadingChecklist ? 'Loading…' : 'Load Inclusive Checklist (default)'}
                </button>

                <div>
                  <input
                    id="chk-upload"
                    type="file"
                    accept="application/json"
                    className="d-none"
                    onChange={onFilePick}
                    data-testid="source-file"
                  />
                  <label htmlFor="chk-upload" className="btn btn-outline-secondary">
                    Upload custom JSON
                  </label>
                </div>
              </div>
              {error && <div className="text-danger small mt-2">{error}</div>}
            </div>

            {/* Quick stats + save */}
            <div className="col-12 col-md-3">
              <div className="mb-2">
                <div className="small text-muted">Progress</div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge text-bg-success" title="Covered (Bronze/Silver/Gold)">{stats.covered}</span>
                  <span className="badge text-bg-secondary" title="Not applicable">{stats.na}</span>
                  <span className="badge text-bg-warning text-dark" title="Remaining">{stats.remaining}</span>
                  <span className="badge text-bg-light text-dark ms-auto" title="Total">{stats.total}</span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleSave}
                data-testid="save-report-btn"
                disabled={!items.length || !buildingId}
                aria-disabled={!items.length || !buildingId}
              >
                Save Report
              </button>
              {!buildingId && <div className="form-text">Select a building to enable saving.</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Expandable sections with per-item radios */}
      <Sections />
    </div>
  );
}
