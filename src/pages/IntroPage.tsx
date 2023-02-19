import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
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

      contentRef.current.style.width = `${state.size.width * 0.75}px`;

      const yPercent = enterAmount + exitAmount;

      const viewportHeight = state.viewport.height;
      groupRef.current.position.setY(yPercent * viewportHeight);
    }
  );

  useFrame((state) => {
    const mouse = state.mouse;
    if (groupRef.current === null) return;
    groupRef.current.lookAt(mouse.x, mouse.y, 50);
  });

  return (
    <group ref={groupRef}>
      <Html
        ref={contentRef}
        transform
        distanceFactor={1}
        // style={{
        //   backgroundColor: "rgba(0, 0, 1, 0.1)",
        // }}
        portal={{ current: htmlPortal }}
      >
        <div className="flex justify-center items-center">
          <p className="font-bold text-3xl leading-none sm:text-5xl md:text-7xl">
            Hi. My name is <br />
            <span style={{ fontSize: "3em" }}>Bryan Lindsey.</span>
          </p>
        </div>
      </Html>
    </group>
  );
};
