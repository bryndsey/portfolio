import { atom, useSetAtom } from "jotai";
import { PropsWithChildren } from "react";
import { MathUtils } from "three";

export type NormalizedMousePosition = {
  readonly x: number;
  readonly y: number;
};

// Assumption: there will only be a single MouseTracker used - otherwise this value
// will get overwritten by other usages.
export let normalizedMousePosition: NormalizedMousePosition | null = null;

export const hasDetectedMouse = atom(false);

export function MouseTracker({ children }: PropsWithChildren) {
  const setDetectedMouse = useSetAtom(hasDetectedMouse);
  return (
    <div
      className="w-full h-full"
      onPointerMove={(e) => {
        if (e.pointerType === "mouse") {
          setDetectedMouse(true);
          const normalizedX = MathUtils.mapLinear(
            e.clientX,
            0,
            e.currentTarget.clientWidth,
            -1,
            1
          );

          // Go from positive to negative to map properly
          const normalizedY = MathUtils.mapLinear(
            e.clientY,
            0,
            e.currentTarget.clientHeight,
            1,
            -1
          );
          normalizedMousePosition = { x: normalizedX, y: normalizedY };
        }
      }}
      onPointerLeave={(e) => {
        const clientRect = e.currentTarget.getBoundingClientRect();
        if (
          e.clientX < clientRect.left ||
          e.clientY < clientRect.top ||
          e.clientX > clientRect.right ||
          e.clientY > clientRect.bottom
        ) {
          normalizedMousePosition = null;
        }
      }}
    >
      {children}
    </div>
  );
}
