import { useSpringValue } from "@react-spring/web";
import { useProgress } from "@react-three/drei";

export function useIsLoaded() {
  const loadingTransistionValue = useSpringValue(0);
  useProgress((state) => {
    const finishedLoading = !state.active && state.progress === 100;
    const actualTarget = finishedLoading ? 1 : 0;
    if (loadingTransistionValue.goal !== actualTarget) {
      loadingTransistionValue.start(actualTarget);
    }
  });

  return loadingTransistionValue;
}
