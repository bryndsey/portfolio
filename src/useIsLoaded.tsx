import { useSpringValue } from "@react-spring/web";
import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

type LoadingState = "loading" | "transistion" | "loaded";

export function useIsLoaded() {
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const loadingTransistionValue = useSpringValue(0, {
    config: { duration: 750 },
  });
  const finishedLoading = useProgress(
    (state) => !state.active && state.progress === 100
  );

  useEffect(() => {
    const actualTarget = finishedLoading ? 1 : 0;
    if (loadingTransistionValue.goal !== actualTarget) {
      loadingTransistionValue.start(actualTarget, {
        onChange(result) {
          if (
            result.value !== 0 &&
            result.value !== 1 &&
            loadingState !== "transistion"
          ) {
            setLoadingState("transistion");
          }
        },
        onRest(result) {
          if (result.value === 0) {
            setLoadingState("loading");
          } else if (result.value === 1) {
            setLoadingState("loaded");
          }
        },
      });
    }
  }, [finishedLoading]);

  return { loadingTransistionValue, loadingState };
}
