import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import { useHtmlPortal } from "../useHtmlPortal";
import { PageComponentProps } from "./Pages";
import { useScrollPages } from "./useScrollPages";

export const AboutPage = (props: PageComponentProps) => {
  const viewportWidth = useThree((state) => state.size.width);
  const htmlPortal = useHtmlPortal();
  const groupRef = useRef<Group>(null);
  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    (enterAmount, exitAmount, state) => {
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
        style={{ width: viewportWidth * 0.75 }}
        portal={{ current: htmlPortal }}
        distanceFactor={1}
      >
        <p className="text-4xl whitespace-pre-line">
          {`I like to make things for the web and Android, including games and apps to make music.





          Keep scrolling to see some things I've made.`}
        </p>
      </Html>
    </group>
  );
};