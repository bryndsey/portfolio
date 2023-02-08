import { Html, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import { useHtmlPortal } from "../../../useHtmlPortal";
import { PageComponentProps } from "../../Pages";
import { useScrollPages } from "../../useScrollPages";
import { Guitar } from "./Guitar";

export const GuitarPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);

  const viewport = useThree((state) => state.viewport);

  const htmlPortal = useHtmlPortal();

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    (enterAmount, exitAmount, state, delta) => {
      if (groupRef.current === null) return;

      const yPercent = enterAmount + exitAmount;

      const viewportHeight = state.viewport.height;
      groupRef.current.position.setY(yPercent * viewportHeight);
    }
  );

  return (
    <group ref={groupRef}>
      <Html
        transform
        style={{
          width: viewport.width / 3,
        }}
        // fontSize={0.15}
        position={[-viewport.width / 5, viewport.height / 5, 0]}
        portal={{ current: htmlPortal }}
        distanceFactor={1}
      >
        <h2>SongSpark</h2>
      </Html>
      <group
        position={[viewport.width / 5, 0, 0]}
        rotation={[Math.PI / 2, -0.25, 0.6]}
      >
        <Guitar />
      </group>
    </group>
  );
};
