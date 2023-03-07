import { Html } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import { useHtmlPortal } from "../useHtmlPortal";
import { PageComponentProps } from "./Pages";
import { useScrollPages } from "./useScrollPages";

export const IntroPage = (props: PageComponentProps) => {
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
        <div className="h-full m-auto w-3/4 flex justify-center items-center">
          <p className="font-bold text-3xl leading-none md:text-5xl lg:text-7xl">
            Hi. My name is <br />
            <span style={{ fontSize: "3em" }}>Bryan Lindsey.</span>
          </p>
        </div>
      </Html>
    </group>
  );
};
