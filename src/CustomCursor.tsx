import { useAtomValue } from "jotai";
import { Cursor } from "react-creative-cursor";
import { hasDetectedMouse } from "./mousePosition";
import "react-creative-cursor/dist/styles.css";

export function CustomCursor() {
  const mouseDetected = useAtomValue(hasDetectedMouse);
  if (!mouseDetected) return null;

  return (
    <Cursor
      animationDuration={0.2}
      cursorSize={20}
      cursorBackgrounColor="rgba(0, 150, 60, 0.97"
    />
  );
}
