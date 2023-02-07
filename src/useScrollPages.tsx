import { useScroll } from "@react-three/drei";
import { RootState, useFrame } from "@react-three/fiber";

export const useScrollPages = (
  totalPages: number,
  progressCallback: (
    enterAmount: number,
    exitAmount: number,
    state: RootState,
    frameDelta: number
  ) => void,
  startPageIndex: number,
  endPageIndex?: number
) => {
  const actualEndPageIndex =
    endPageIndex === undefined ? startPageIndex : endPageIndex;
  const scrollData = useScroll();
  useFrame((state, delta) => {
    const enterAmount =
      scrollData.range(
        (startPageIndex - 1) / totalPages,
        startPageIndex / totalPages
      ) - 1;
    const exitAmount = scrollData.range(
      actualEndPageIndex / totalPages,
      (actualEndPageIndex + 1) / totalPages
    );
    progressCallback(enterAmount, exitAmount, state, delta);
  });
};
