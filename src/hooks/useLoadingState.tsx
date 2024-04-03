import { useSpringValue } from "@react-spring/web";
import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { getGPUTier } from "detect-gpu";

type LoadingState = "loading" | "transistion" | "loaded";

export type GpuType = "mobile" | "desktop";
export type GpuRating = {
  type: GpuType;
  tier: number;
};

export function useLoadingState() {
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [gpuSettings, setGpuSettings] = useState<GpuRating | null>(null);
  const loadingTransistionValue = useSpringValue(0, {
    config: { duration: 750 },
  });
  const finishedLoading = useProgress(
    (state) => !state.active && state.progress === 100 && gpuSettings !== null
  );

  useEffect(() => {
    const actualTarget = finishedLoading ? 1 : 0;
    if (loadingTransistionValue.goal !== actualTarget) {
      loadingTransistionValue.start(actualTarget, {
        onChange(result) {
          if (
            loadingState !== "transistion" &&
            result.value !== 0 &&
            result.value !== 1
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
        delay: 250,
      });
    }
  }, [finishedLoading]);

  useEffect(() => {
    async function getGpuSettings() {
      const gpuTier = await getGPUTier();
      const rating: GpuRating = {
        type: gpuTier.isMobile ? "mobile" : "desktop",
        tier: gpuTier.tier,
      };
      setGpuSettings(rating);
    }

    getGpuSettings();
  }, []);

  return { loadingTransistionValue, loadingState, gpuSettings };
}
