import { useCallback, useSyncExternalStore } from 'react';
import type { Store } from './store';

/** Subscribes a component to a vanilla `Store`, re-rendering on every state change. */
export function useAppStore<T extends object>(store: Store<T>): T {
  const subscribe = useCallback(
    (listener: () => void) => store.subscribe(listener),
    [store],
  );
  const getSnapshot = useCallback(() => store.getState(), [store]);
  return useSyncExternalStore(subscribe, getSnapshot);
}
