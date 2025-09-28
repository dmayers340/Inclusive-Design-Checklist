import React, { useRef, useState } from 'react';

/**
 * @param {{ onItemsLoaded: (items:Array)=>void }} props
 */
export default function SourceSelector({ onItemsLoaded }) {
  const fileRef = useRef(null);
  const [source, setSource] = useState('');
  const [meta, setMeta] = useState({ label: '', count: 0, error: '' });

  const applyItems = (items, label) => {
    onItemsLoaded(Array.isArray(items) ? items : []);
    setMeta({ label, count: Array.isArray(items) ? items.length : 0, error: '' });
  };

  const loadSample = async () => {
    try {
      const res = await fetch('/inputs/inclusive_checklist.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Sample JSON not found at /inclusive_checklist.json');
      const json = await res.json();
      applyItems(json, 'Inclusive Design Checklist: inclusive_checklist.json');
    } catch (e) {
      setMeta({ label: '', count: 0, error: e.message || 'Failed to load sample' });
    }
  };

  const onFilePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      applyItems(json, `Custom: ${file.name}`);
    } catch {
      setMeta({ label: '', count: 0, error: 'Invalid JSON file' });
    } finally {
      // allow selecting same file again later
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Select Source */}
      <label htmlFor="source-select" className="text-sm font-medium">
        Checklist Source
      </label>
      <select
        id="source-select"
        className="border rounded-md p-2"
        value={source}
        onChange={(e) => {
          const v = e.target.value;
          setSource(v);
          if (v === 'sample') loadSample();
          if (v === 'upload') fileRef.current?.click();
        }}
      >
        <option value="">Select…</option>
        <option value="sample">Inclusive Design Checklist</option>
        <option value="upload">Upload custom (.json)</option>
      </select>

      {/* Hidden file input */}
      <input
        id="chk-upload"
        ref={fileRef}
        type="file"
        accept="application/json"
        className="hidden"
        data-testid="file-input"
        onChange={onFilePick}
      />
      <label htmlFor="chk-upload" className="btn btn-outline-secondary">
        Upload custom (.json)
      </label>

      {/* Status / Meta */}
      {meta.label && (
        <span className="text-sm text-slate-600">
          Loaded: <strong>{meta.label}</strong> ({meta.count} items)
        </span>
      )}
      {meta.error && <span className="text-sm text-red-600">{meta.error}</span>}
    </div>
  );
}
