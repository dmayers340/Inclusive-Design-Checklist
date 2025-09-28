import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ChecklistProvider, useChecklist, STATUS_OPTS, DEFAULT_STATUS } from '../ChecklistContext';

const wrap = (initialItems=[]) => {
  const wrapper = ({children}) => <ChecklistProvider initialItems={initialItems}>{children}</ChecklistProvider>;
  return wrapper;
};

test('initializes defaults and prunes stale IDs', () => {
  const items1 = [{ ID:'A' }, { ID:'B' }];
  const items2 = [{ ID:'B' }, { ID:'C' }];

  const { result, rerender } = renderHook(() => useChecklist(), { wrapper: wrap(items1) });

  // defaults
  expect(result.current.status.A).toBe(DEFAULT_STATUS);
  expect(result.current.status.B).toBe(DEFAULT_STATUS);

  // set A = Gold
  act(() => result.current.setStatusFor('A', 'Gold'));
  expect(result.current.status.A).toBe('Gold');

  // change items to items2 -> A should be pruned, C added with default
  rerender({ children: null, wrapper: wrap(items2) });
  // re-render hook in new provider
  const again = renderHook(() => useChecklist(), { wrapper: wrap(items2) });
  expect(again.result.current.status.A).toBeUndefined();
  expect(again.result.current.status.B).toBe(DEFAULT_STATUS);
  expect(again.result.current.status.C).toBe(DEFAULT_STATUS);
});

test('rejects invalid statuses and supports Not applicable', () => {
  const items = [{ ID:'A' }];
  const { result } = renderHook(() => useChecklist(), { wrapper: wrap(items) });

  act(() => result.current.setStatusFor('A', 'Goldish')); // invalid -> default
  expect(result.current.status.A).toBe(DEFAULT_STATUS);

  act(() => result.current.setStatusFor('A', 'Not applicable'));
  expect(result.current.status.A).toBe('Not applicable');

  expect(STATUS_OPTS).toContain('Not applicable');
});
