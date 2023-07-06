import { useProgress } from "@react-three/drei";

export function useIsLoaded() {
  return useProgress((state) => !state.active && state.progress === 100);
}
