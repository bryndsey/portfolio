import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import { useHtmlPortal } from "../useHtmlPortal";
import { PageComponentProps } from "./Pages";
import { useScrollPages } from "./useScrollPages";

export const IntroPage = (props: PageComponentProps) => {
  const size = useThree((state) => state.size);

  const htmlPortal = useHtmlPortal();

  const groupRef = useRef<Group>(null);

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    ({ enterAmount, exitAmount, state }) => {
      if (groupRef.current === null) return;

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
        transform
        position={[0, 0, 0]}
        distanceFactor={1}
        style={{
          // backgroundColor: "rgba(0, 0, 1, 0.1)",
          width: size.width * 0.75,
        }}
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
