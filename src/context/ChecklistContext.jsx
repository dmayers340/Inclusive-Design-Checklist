import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const ChecklistContext = createContext(null);

// Public constants for consumers (tables, pages, tests)
export const STATUS_OPTS = ['Not evaluated', 'Not met', 'Not applicable', 'Bronze', 'Silver', 'Gold'];
export const DEFAULT_STATUS = 'Not evaluated';

// If you want to isolate different reports/buildings later, change this to include a suffix.
const STORAGE_KEY = 'inclusive-audit-status';

export function ChecklistProvider({ children, initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [status, setStatus] = useState({}); // { [id]: status }

  // Keep items in sync when the prop changes
  useEffect(() => {
    setItems(initialItems ?? []);
  }, [initialItems]);

  // Load/persist status in localStorage (guard for SSR)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const stored = JSON.parse(raw);
      if (stored && typeof stored === 'object') setStatus(stored);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
  }, [status]);

  // Initialize defaults AND prune stale IDs whenever items change
  useEffect(() => {
    if (!items?.length) {
      setStatus({});
      return;
    }
    setStatus(prev => {
      const next = { ...prev };
      const validIds = new Set(items.map(it => it.ID));

      for (const it of items) {
        if (!next[it.ID]) next[it.ID] = DEFAULT_STATUS;
        if (!STATUS_OPTS.includes(next[it.ID])) next[it.ID] = DEFAULT_STATUS;
      }
      for (const k of Object.keys(next)) {
        if (!validIds.has(k)) delete next[k];
      }
      return next;
    });
  }, [items]);

  // ---- Stable callbacks (useCallback) ----

  const setStatusFor = useCallback((id, value) => {
    // ignore unknown IDs and invalid values
    if (!items.find(it => it.ID === id)) return;
    const v = STATUS_OPTS.includes(value) ? value : DEFAULT_STATUS;
    setStatus(prev => (prev[id] === v ? prev : { ...prev, [id]: v }));
  }, [items]);

  const setManyStatuses = useCallback((entries) => {
    // entries: Array<[id, value]>
    setStatus(prev => {
      const next = { ...prev };
      let changed = false;
      for (const [id, value] of entries) {
        if (!items.find(it => it.ID === id)) continue;
        const v = STATUS_OPTS.includes(value) ? value : DEFAULT_STATUS;
        if (next[id] !== v) { next[id] = v; changed = true; }
      }
      return changed ? next : prev;
    });
  }, [items]);

  const resetAll = useCallback((to = DEFAULT_STATUS) => {
    const v = STATUS_OPTS.includes(to) ? to : DEFAULT_STATUS;
    const next = {};
    for (const it of items) next[it.ID] = v;
    setStatus(next);
  }, [items]);

  const clearStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    // reuse the stable resetAll
    resetAll(DEFAULT_STATUS);
  }, [resetAll]);

  // ---- Memoized context value ----
  const value = useMemo(() => ({
    items,
    setItems,            // useState setter is stable but harmless to list
    status,
    setStatusFor,
    setManyStatuses,
    resetAll,
    clearStorage,
    STATUS_OPTS,         // module constants; identities don’t change
    DEFAULT_STATUS
  }), [items, status, setItems, setStatusFor, setManyStatuses, resetAll, clearStorage]);

  return <ChecklistContext.Provider value={value}>{children}</ChecklistContext.Provider>;
}

export function useChecklist() {
  const ctx = useContext(ChecklistContext);
  if (!ctx) throw new Error('useChecklist must be used within ChecklistProvider');
  return ctx;
}
