import { PropsWithChildren } from "react";
import { MathUtils } from "three";

export type NormalizedMousePosition = {
  readonly x: number;
  readonly y: number;
};

// Assumption: there will only be a single MouseTracker used - otherwise this value
// will get overwritten by other usages.
export let normalizedMousePosition: NormalizedMousePosition | null = null;

export interface MouseTrackerProps {
  children?: React.ReactNode;
  className?: string;
}

export function MouseTracker({ children, className }: MouseTrackerProps) {
  return (
    <div
      className={className}
      onPointerMove={(e) => {
        if (e.pointerType === "mouse") {
          const normalizedX = MathUtils.mapLinear(
            e.clientX,
            0,
            window.innerWidth,
            -1,
            1
          );

          // Go from positive to negative to map properly
          const normalizedY = MathUtils.mapLinear(
            e.clientY,
            0,
            window.innerHeight,
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
