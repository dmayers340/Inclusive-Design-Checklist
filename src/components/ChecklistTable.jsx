import React, { useMemo } from 'react';

import { useChecklist } from '../context/ChecklistContext';

const STATUS_OPTS = ['Not evaluated', 'Not met', "Not Applicable", 'Bronze', 'Silver', 'Gold'];

function SeverityBadge({ s }) {
    const cls =
        s === 'Critical' ? 'bg-red-100 text-red-800'
            : s === 'High' ? 'bg-orange-100 text-orange-800'
                : s === 'Medium' ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-emerald-100 text-emerald-800';
    return <span className={`px-2 py-1 rounded text-xs ${cls}`}>{s}</span>;
}

export default function ChecklistTable({ filters }) {
    const { items, status, setStatusFor } = useChecklist();

    const filtered = useMemo(() => {
        const q = filters.q.trim().toLowerCase();
        return items.filter(r => {
            const spaceOk = filters.space === 'All' || (r.Spaces || '').split('|').map(x => x.trim()).includes(filters.space);
            const sevOk = filters.severity === 'All' || r.Severity === filters.severity;
            const qOk = !q || [r.ID, r['Checklist Item (Raw)'], r.Bronze, r.Silver, r.Gold, r.Spaces].join(' ').toLowerCase().includes(q);
            return spaceOk && sevOk && qOk;
        });
    }, [items, filters]);

    return (
        <div className="border rounded-xl overflow-hidden shadow">
            <table className="w-full text-sm">
                <thead className="bg-slate-50">
                    <tr>
                        <Th>ID</Th>
                        <Th>Checklist Item</Th>
                        <Th>Severity</Th>
                        <Th>Spaces</Th>
                        <Th>Bronze</Th>
                        <Th>Silver</Th>
                        <Th>Gold</Th>
                        <Th>Status</Th>
                        <Th>Dupes</Th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(r => {
                        const id = r.ID;
                        const cur = status[id] || 'Not evaluated';
                        const name = `status-${id}`; // group name for this item’s radios

                        return (
                            <tr key={id} className="border-t align-top">
                                <Td><span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{id}</span></Td>
                                <Td>{r['Checklist Item (Raw)']}</Td>
                                <Td><SeverityBadge s={r.Severity} /></Td>
                                <Td>{r.Spaces}</Td>
                                <Td>{r.Bronze}</Td>
                                <Td>{r.Silver}</Td>
                                <Td>{r.Gold}</Td>
                                <Td>
                                    <fieldset>
                                        <legend className="visually-hidden">Compliance status for {id}</legend>
                                        <div className="flex flex-col gap-1">
                                            {STATUS_OPTS.map(opt => {
                                                const safeOpt = opt.replace(/\s+/g, '-').replace(/[^\w-]/g, '').toLowerCase();
                                                const inputId = `${name}-${safeOpt}`;
                                                return (
                                                    <div className="form-check" key={opt}>
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            id={inputId}
                                                            name={name}
                                                            value={opt}
                                                            checked={cur === opt}
                                                            onChange={() => setStatusFor(id, opt)}
                                                        />
                                                        <label className="form-check-label text-xs" htmlFor={inputId}>{opt}</label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </fieldset>
                                </Td>
                                <Td>
                                    <div className="flex flex-col gap-1">
                                        {STATUS_OPTS.map(opt => (
                                            <label key={opt} className="inline-flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={name}
                                                    value={opt}
                                                    checked={cur === opt}
                                                    onChange={() => setStatusFor(id, opt)}
                                                />
                                                <span className="text-xs">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </Td>
                                <Td className="text-xs text-slate-500">{r['Potential Duplicates']}</Td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function Th({ children }) {
    return <th className="text-left p-3 text-xs font-semibold text-slate-600">{children}</th>;
}
function Td({ children, className = '' }) {
    return <td className={`p-3 ${className}`}>{children}</td>;
}
