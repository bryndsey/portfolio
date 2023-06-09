import { RootState, useFrame } from "@react-three/fiber";
import { useLenis } from "@studio-freight/react-lenis";
import Lenis from "@studio-freight/lenis";
import { useRef } from "react";
import { MathUtils } from "three";
import { pages } from "./Pages";

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
  const scrollProgress = useRef(0);

  // const scrollData = useScroll();
  useLenis((lenis: Lenis) => {
    scrollProgress.current = lenis.progress;
  });

  useFrame((state, delta) => {
    const enterTransitionLength = 1;
    const enterVisiblePageIndex = startPageIndex - 1;
    const exitTransitionLength = 1;
    const exitVisiblePageIndex = endPageIndex + exitTransitionLength;
    const totalVisibleLength = exitVisiblePageIndex - enterVisiblePageIndex;

    const enterAmount =
      MathUtils.clamp(
        MathUtils.inverseLerp(
          enterVisiblePageIndex / pages.totalPages,
          (enterVisiblePageIndex + enterTransitionLength) / pages.totalPages,
          scrollProgress.current
        ),
        0,
        1
      ) - 1;
    // scrollData.range(
    //   enterVisiblePageIndex / pages.totalPages,
    //   enterTransitionLength / pages.totalPages
    // ) - 1;

    const contentPages = endPageIndex - startPageIndex;
    const contentProgressAmount = MathUtils.clamp(
      MathUtils.inverseLerp(
        startPageIndex / pages.totalPages,
        (startPageIndex + contentPages) / pages.totalPages,
        scrollProgress.current
      ),
      0,
      1
    );

    // scrollData.range(
    //   startPageIndex / pages.totalPages,
    //   contentPages / pages.totalPages
    // );

    const exitAmount = MathUtils.clamp(
      MathUtils.inverseLerp(
        endPageIndex / pages.totalPages,
        (endPageIndex + exitTransitionLength) / pages.totalPages,
        scrollProgress.current
      ),
      0,
      1
    );

    // scrollData.range(
    //   endPageIndex / pages.totalPages,
    //   exitTransitionLength / pages.totalPages
    // );

    const isVisible =
      scrollProgress.current >
        enterVisiblePageIndex / pages.totalPages - 0.001 &&
      scrollProgress.current <
        (enterVisiblePageIndex + totalVisibleLength) / pages.totalPages + 0.001;

    // scrollData.visible(
    //   enterVisiblePageIndex / pages.totalPages,
    //   totalVisibleLength / pages.totalPages,
    //   -0.001
    // );

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
