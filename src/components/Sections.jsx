import React, { useMemo, useState } from 'react';

import { useChecklist } from '../context/ChecklistContext';
import { groupByPrimarySpace } from '../utils/grouping';

const STATUS_OPTS = ['Not evaluated','Not met','Not applicable','Bronze','Silver','Gold'];

function SectionCounters({ items, status }) {
  let covered = 0, remaining = 0, na = 0;
  items.forEach(it => {
    const st = status[it.ID] || 'Not evaluated';
    if (st === 'Not applicable') na++;
    else if (st === 'Bronze' || st === 'Silver' || st === 'Gold') covered++;
    else remaining++;
  });
  return (
    <span className="ms-2 small">
      <span className="badge text-bg-success me-1" title="Covered (Bronze/Silver/Gold)">{covered}</span>
      <span className="badge text-bg-secondary me-1" title="Not applicable">{na}</span>
      <span className="badge text-bg-warning text-dark" title="Remaining (Not evaluated/Not met)">{remaining}</span>
    </span>
  );
}

export default function Sections() {
  const { items, status, setStatusFor, DEFAULT_STATUS } = useChecklist();
  const { order, groups } = useMemo(() => groupByPrimarySpace(items), [items]);
  const [openKey, setOpenKey] = useState(null);

  if (!items?.length) {
    return <div className="alert alert-info">Load a checklist to begin.</div>;
  }

  return (
    <div className="accordion" id="step1-accordion">
      {order.map((spaceKey, idx) => {
        const secId = `sec-${idx}`;
        const isOpen = openKey === spaceKey;
        const sectionItems = groups[spaceKey];

        return (
          <div className="accordion-item" key={spaceKey}>
            <h2 className="accordion-header" id={`hdr-${secId}`}>
              <button
                className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                type="button"
                aria-expanded={isOpen}
                aria-controls={`col-${secId}`}
                onClick={() => setOpenKey(isOpen ? null : spaceKey)}
              >
                <span className="fw-semibold">{spaceKey}</span>
                <SectionCounters items={sectionItems} status={status} />
              </button>
            </h2>
            <div
              id={`col-${secId}`}
              className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
              aria-labelledby={`hdr-${secId}`}
              data-bs-parent="#step1-accordion"
            >
              <div className="accordion-body">
                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{width: '9rem'}}>ID</th>
                        <th>Checklist Item</th>
                        <th>Severity</th>
                        <th>Bronze</th>
                        <th>Silver</th>
                        <th>Gold</th>
                        <th style={{width: '20rem'}}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sectionItems.map(it => {
                        const cur = status[it.ID] || DEFAULT_STATUS;
                        const groupName = `st-${it.ID}`;
                        return (
                          <tr key={it.ID}>
                            <td><code>{it.ID}</code></td>
                            <td>{it['Checklist Item (Raw)'] || it['Checklist Item']}</td>
                            <td><span className={`badge ${it.Severity==='Critical'?'text-bg-danger':it.Severity==='High'?'text-bg-warning text-dark':it.Severity==='Medium'?'text-bg-info':'text-bg-secondary'}`}>{it.Severity || '—'}</span></td>
                            <td>{it.Bronze}</td>
                            <td>{it.Silver}</td>
                            <td>{it.Gold}</td>
                            <td>
                              <fieldset>
                                <legend className="visually-hidden">Status for {it.ID}</legend>
                                <div className="d-flex flex-wrap gap-2">
                                  {STATUS_OPTS.map(opt => {
                                    const inputId = `${groupName}-${opt.replace(/\s+/g,'-').toLowerCase()}`;
                                    return (
                                      <div className="form-check form-check-inline" key={opt}>
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          id={inputId}
                                          name={groupName}
                                          checked={cur === opt}
                                          onChange={() => setStatusFor(it.ID, opt)}
                                        />
                                        <label className="form-check-label" htmlFor={inputId}>{opt}</label>
                                      </div>
                                    );
                                  })}
                                </div>
                              </fieldset>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Quick actions (optional): mark all in this section */}
                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => sectionItems.forEach(it => setStatusFor(it.ID, 'Not evaluated'))}
                  >Mark all Not evaluated</button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => sectionItems.forEach(it => setStatusFor(it.ID, 'Not applicable'))}
                  >Mark all N/A</button>
                </div>

              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
