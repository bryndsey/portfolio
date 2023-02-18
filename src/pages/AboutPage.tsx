import { Html } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import { useHtmlPortal } from "../useHtmlPortal";
import { PageComponentProps } from "./Pages";
import { useScrollPages } from "./useScrollPages";

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
    <group ref={groupRef}>
      <Html ref={contentRef} fullscreen portal={{ current: htmlPortal }}>
        <div className="h-full w-3/4 flex flex-col justify-around m-auto">
          <p className="font-semibold text-4xl sm:text-6xl">
            {
              "I like to make things for the web and Android, including games and apps to make music."
            }
          </p>
          <p className="text-xl sm:text-3xl text-center">
            {"Keep scrolling to see some things I've made."}
          </p>
        </div>
      </Html>
    </group>
  );
};
