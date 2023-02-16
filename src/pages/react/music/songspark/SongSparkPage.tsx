import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import { ProjectDescription, ReactTag } from "../../../../ProjectDescription";
import { useHtmlPortal } from "../../../../useHtmlPortal";
import { PageComponentProps } from "../../../Pages";
import { useScrollPages } from "../../../useScrollPages";
import { AcousticGuitar } from "./AcousticGuitar";

export const SongSparkPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const viewport = useThree((state) => state.viewport);
  const size = useThree((state) => state.size);

  const htmlPortal = useHtmlPortal();

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    ({ enterAmount, exitAmount, state }) => {
      if (groupRef.current === null) return;

      const yPercent = enterAmount + exitAmount;

      const viewportHeight = state.viewport.height;
      groupRef.current.position.setY(yPercent * viewportHeight);

      const showDescription = yPercent === 0;
      if (descriptionRef.current === null) return;
      descriptionRef.current.style.opacity = showDescription ? "1" : "0";
    }
  );

  return (
    <group ref={groupRef}>
      <Html
        ref={descriptionRef}
        transform
        style={{
          width: size.width / 2,
          transition: "opacity 300ms",
          // backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
        position={[-viewport.width / 6, viewport.height / 5, 0]}
        portal={{ current: htmlPortal }}
        distanceFactor={1}
      >
        <ProjectDescription
          projectName="SongSpark"
          descriptionText="SongSpark inspires songwriters with generated melodies and chord progressions"
          tags={[ReactTag]}
        />
      </Html>
      <group
        position={[viewport.width / 5, 0, 0]}
        rotation={[Math.PI / 2, -0.25, 0.6]}
      >
        <AcousticGuitar />
      </group>
    </group>
  );
};
