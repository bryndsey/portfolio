import { PerformanceMonitor } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export function PerformanceControl() {
  const setDpr = useThree((state) => state.setDpr);
  return (
    <PerformanceMonitor
      factor={0.6}
      threshold={0.9}
      bounds={(refreshRate) => {
        return refreshRate > 60 ? [55, 65] : [25, 45];
      }}
      onChange={({ factor }) => {
        const newDpr = 1 + 1 * factor;
        setDpr(Math.min(window.devicePixelRatio, newDpr));
      }}
    ></PerformanceMonitor>
  );
}
