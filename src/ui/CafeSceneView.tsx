/**
 * Thin React wrapper around the `<cafe-scene>` custom element. React only
 * mounts the tag and hands back a ref — every interaction (`enter`, `goTo`,
 * `setLock`, `setOptions`) stays imperative, called directly on the element.
 */
import type { ReactElement, Ref } from 'react';
import '../scene/CafeSceneElement';
import type { CafeSceneElement } from '../scene/CafeSceneElement';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- augments React.JSX so <cafe-scene> type-checks
  namespace JSX {
    interface IntrinsicElements {
      'cafe-scene': DetailedHTMLProps<HTMLAttributes<HTMLElement>, CafeSceneElement>;
    }
  }
}

interface CafeSceneViewProps {
  readonly sceneRef: Ref<CafeSceneElement>;
}

export function CafeSceneView({ sceneRef }: CafeSceneViewProps): ReactElement {
  return <cafe-scene ref={sceneRef} className="scene-layer" />;
}
