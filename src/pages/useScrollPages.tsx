import { useScroll } from "@react-three/drei";
import { RootState, useFrame } from "@react-three/fiber";

export function useScrollPages(
  startPageIndex: number,
  endPageIndex: number,
  progressCallback: (
    enterAmount: number,
    contentProgressAmount: number,
    exitAmount: number,
    state: RootState,
    frameDelta: number
  ) => void
) {
  const scrollData = useScroll();
  useFrame((state, delta) => {
    const totalPages = scrollData.pages;
    const enterAmount =
      scrollData.range((startPageIndex - 1) / totalPages, 1 / totalPages) - 1;

    const contentPages = endPageIndex - startPageIndex;
    const contentProgressAmount = scrollData.range(
      startPageIndex / totalPages,
      contentPages / totalPages
    );

    const exitAmount = scrollData.range(
      endPageIndex / totalPages,
      1 / totalPages
    );
    progressCallback(
      enterAmount,
      contentProgressAmount,
      exitAmount,
      state,
      delta
    );
  });
}
