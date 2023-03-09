import { Html } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { Group } from "three";
import { useHtmlPortal } from "../useHtmlPortal";
import { PageComponentProps } from "./Pages";
import { useScrollPages } from "./useScrollPages";

const listOfThingsIMake = [
  "React apps",
  "Music",
  "Games",
  "3D models",
  "Android apps",
];

export const AboutPage = (props: PageComponentProps) => {
  const htmlPortal = useHtmlPortal();
  const groupRef = useRef<Group>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    ({ enterAmount, exitAmount, isPageVisible, state }) => {
      if (groupRef.current === null) return;

      groupRef.current.visible = isPageVisible;

      if (contentRef.current === null) return;
      contentRef.current.hidden = !isPageVisible;

      const yPercent = enterAmount + exitAmount;

      const viewportHeight = state.viewport.height;
      groupRef.current.position.setY(yPercent * viewportHeight);
    }
  );

  return (
    <Suspense fallback={null}>
      <group ref={groupRef}>
        <Html ref={contentRef} fullscreen portal={{ current: htmlPortal }}>
          <div className="h-full w-3/4 flex flex-col justify-around m-auto">
            <p className="font-semibold text-2xl sm:text-4xl md:text-6xl">
              {`I like to make things. ${listOfThingsIMake.join(". ")}.`}
            </p>
            <p className="text-base sm:text-xl md:text-3xl text-center">
              {"Keep scrolling to see some things I've made."}
            </p>
          </div>
        </Html>
      </group>
    </Suspense>
  );
};
