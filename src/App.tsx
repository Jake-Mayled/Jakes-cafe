/** App shell: owns the store, ambience, and scene element, and wires the overlay UI. */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { CafeAmbience } from './audio/ambience';
import { CAFE_NAME, NEON_COLOR } from './config';
import { CAFE_PROGRESS, CAFE_READY, CAFE_SECTION } from './events';
import type { CafeSceneElement } from './scene/CafeSceneElement';
import type { ViewIndex } from './types';
import { CafeSceneView } from './ui/CafeSceneView';
import type { AppActions } from './ui/component';
import { FlatView } from './ui/FlatView';
import { Hud } from './ui/Hud';
import { Loader } from './ui/Loader';
import { Panel } from './ui/panel/Panel';
import { INITIAL_STATE, Store, type AppState, type ExperienceTab } from './ui/store';
import { StopsNav } from './ui/StopsNav';
import { useAppStore } from './ui/useAppStore';

export function App(): ReactElement {
  const [store] = useState(() => new Store<AppState>(INITIAL_STATE));
  const [ambience] = useState(() => new CafeAmbience());

  const sceneRef = useRef<CafeSceneElement>(null);
  const state = useAppStore(store);

  const actions = useMemo<AppActions>(
    () => ({
      enter: (): void => {
        store.setState({ entered: true });
        sceneRef.current?.enter();
        ambience.start();
      },
      goTo: (view: ViewIndex): void => {
        sceneRef.current?.goTo(view);
      },
      toggleMute: (): void => {
        const muted = !store.getState().muted;
        store.setState({ muted });
        ambience.setMuted(muted);
      },
      openFlat: (): void => {
        store.setState({ flat: true });
        sceneRef.current?.setLock(true);
      },
      closeFlat: (): void => {
        store.setState({ flat: false });
        sceneRef.current?.setLock(false);
      },
      closePanel: (): void => {
        store.setState((prev) => ({ dismissed: prev.section }));
        sceneRef.current?.goTo(0);
      },
      nextStop: (): void => {
        const { section } = store.getState();
        const next = section >= 5 ? 0 : section + 1;
        store.setState({ dismissed: -1 });
        sceneRef.current?.goTo(toViewIndex(next));
      },
      setExperienceTab: (tab: ExperienceTab): void => {
        store.setState({ expTab: tab });
      },
    }),
    [store, ambience],
  );

  useEffect(() => {
    const onProgress = (event: WindowEventMap[typeof CAFE_PROGRESS]): void => {
      store.setState({ pct: event.detail.pct });
    };
    const onReady = (): void => {
      store.setState({ ready: true });
    };
    const onSection = (event: WindowEventMap[typeof CAFE_SECTION]): void => {
      const section = event.detail.section;
      store.setState((prev) => ({
        section,
        dismissed: section === prev.dismissed ? prev.dismissed : -1,
      }));
    };

    window.addEventListener(CAFE_PROGRESS, onProgress);
    window.addEventListener(CAFE_READY, onReady);
    window.addEventListener(CAFE_SECTION, onSection);

    sceneRef.current?.setOptions({ cafeName: CAFE_NAME, neonColor: NEON_COLOR });

    return () => {
      window.removeEventListener(CAFE_PROGRESS, onProgress);
      window.removeEventListener(CAFE_READY, onReady);
      window.removeEventListener(CAFE_SECTION, onSection);
    };
  }, [store]);

  return (
    <div className="app-shell">
      <CafeSceneView sceneRef={sceneRef} />
      <Loader state={state} onEnter={actions.enter} />
      <Hud state={state} onToggleMute={actions.toggleMute} onOpenFlat={actions.openFlat} />
      <StopsNav state={state} onGoTo={actions.goTo} />
      <Panel
        state={state}
        onClose={actions.closePanel}
        onNext={actions.nextStop}
        onSetExperienceTab={actions.setExperienceTab}
      />
      <FlatView state={state} onClose={actions.closeFlat} />
    </div>
  );
}

function toViewIndex(value: number): ViewIndex {
  switch (value) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 4;
    case 5:
      return 5;
    default:
      return 0;
  }
}
