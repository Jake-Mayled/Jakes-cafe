import { describe, expect, test, vi } from 'vitest';
import { INITIAL_STATE, isPanelVisible, Store, type AppState } from './store';

describe('Store', () => {
  test('setState merges a partial patch into a new state object', () => {
    // Arrange
    const store = new Store<AppState>(INITIAL_STATE);
    const before = store.getState();

    // Act
    store.setState({ entered: true });

    // Assert
    const after = store.getState();
    expect(after.entered).toBe(true);
    expect(after).not.toBe(before);
    expect(before.entered).toBe(false);
  });

  test('setState accepts an updater reading the previous state', () => {
    const store = new Store<AppState>({ ...INITIAL_STATE, section: 3 });

    store.setState((prev) => ({ dismissed: prev.section }));

    expect(store.getState().dismissed).toBe(3);
  });

  test('notifies subscribers with the new state', () => {
    const store = new Store<AppState>(INITIAL_STATE);
    const listener = vi.fn();
    store.subscribe(listener);

    store.setState({ pct: 42 });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ pct: 42 }));
  });

  test('unsubscribe stops notifications', () => {
    const store = new Store<AppState>(INITIAL_STATE);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    unsubscribe();
    store.setState({ pct: 10 });

    expect(listener).not.toHaveBeenCalled();
  });
});

describe('isPanelVisible', () => {
  const base: AppState = { ...INITIAL_STATE, entered: true };

  test('hidden on the street (section 0 or -1)', () => {
    expect(isPanelVisible({ ...base, section: 0 })).toBe(false);
    expect(isPanelVisible({ ...base, section: -1 })).toBe(false);
  });

  test('visible for a content section once entered', () => {
    expect(isPanelVisible({ ...base, section: 1 })).toBe(true);
    expect(isPanelVisible({ ...base, section: 5 })).toBe(true);
  });

  test('hidden before entering', () => {
    expect(isPanelVisible({ ...base, entered: false, section: 2 })).toBe(false);
  });

  test('hidden while the flat version is open', () => {
    expect(isPanelVisible({ ...base, flat: true, section: 2 })).toBe(false);
  });

  test('hidden when the visitor dismissed this section', () => {
    expect(isPanelVisible({ ...base, section: 2, dismissed: 2 })).toBe(false);
    expect(isPanelVisible({ ...base, section: 3, dismissed: 2 })).toBe(true);
  });
});
