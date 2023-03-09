import { useScroll } from "@react-three/drei";
import { RootState, useFrame } from "@react-three/fiber";

type ScrollPageProgress = {
  enterAmount: number;
  contentProgressAmount: number;
  exitAmount: number;
  isPageVisible: boolean;
  state: RootState;
  frameDelta: number;
};

export function useScrollPages(
  startPageIndex: number,
  endPageIndex: number,
  progressCallback: (progress: ScrollPageProgress) => void
) {
  const scrollData = useScroll();
  useFrame((state, delta) => {
    const enterTransitionLength = 1;
    const enterVisiblePageIndex = startPageIndex - 1;
    const exitTransitionLength = 1;
    const exitVisiblePageIndex = endPageIndex + exitTransitionLength;
    const totalVisibleLength = exitVisiblePageIndex - enterVisiblePageIndex;

    const totalPages = scrollData.pages;
    const enterAmount =
      scrollData.range(
        enterVisiblePageIndex / totalPages,
        enterTransitionLength / totalPages
      ) - 1;

    const contentPages = endPageIndex - startPageIndex;
    const contentProgressAmount = scrollData.range(
      startPageIndex / totalPages,
      contentPages / totalPages
    );

    const exitAmount = scrollData.range(
      endPageIndex / totalPages,
      exitTransitionLength / totalPages
    );

    const isVisible = scrollData.visible(
      enterVisiblePageIndex / totalPages,
      totalVisibleLength / totalPages,
      -0.001
    );

    progressCallback({
      enterAmount: enterAmount,
      contentProgressAmount: contentProgressAmount,
      exitAmount: exitAmount,
      isPageVisible: isVisible,
      state: state,
      frameDelta: delta,
    });
  });
}
