import { useAtomValue } from "jotai";
import AnimatedCursor from "react-animated-cursor";
import { hasDetectedMouse } from "./mousePosition";

export function CustomCursor() {
  const mouseDetected = useAtomValue(hasDetectedMouse);

  if (!mouseDetected) return null;

  return (
    <AnimatedCursor
      innerSize={20}
      innerScale={2}
      outerAlpha={0}
      innerStyle={{
        backgroundColor: "rgba(0, 150, 60, 0.97)",
        animation: "squiggly-anim 0.66s linear infinite",
      }}
    />
  );
}
