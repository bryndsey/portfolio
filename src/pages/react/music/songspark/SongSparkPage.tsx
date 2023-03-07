import { Center, Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import { ProjectDescription, ReactTag } from "../../../../ProjectDescription";
import { useHtmlPortal } from "../../../../useHtmlPortal";
import { useScreenState } from "../../../../useScreenState";
import { PageComponentProps } from "../../../Pages";
import { useScrollPages } from "../../../useScrollPages";
import { AcousticGuitar } from "./AcousticGuitar";

export const SongSparkPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const viewport = useThree((state) => state.viewport);
  const size = useThree((state) => state.size);
  const screenState = useScreenState();
  const descriptionScaleFactor =
    screenState.deviceClass === "small" &&
    screenState.orientation === "landscape"
      ? 1.5
      : 2;

  const htmlPortal = useHtmlPortal();

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    ({ enterAmount, exitAmount, isPageVisible, state }) => {
      if (groupRef.current === null) return;
      groupRef.current.visible = isPageVisible;

      if (descriptionRef.current === null) return;
      descriptionRef.current.hidden = !isPageVisible;

      if (!isPageVisible) return;

      const yPercent = enterAmount + exitAmount;

      const viewportHeight = state.viewport.height;
      groupRef.current.position.setY(yPercent * viewportHeight);

      const showDescription = yPercent === 0;
      descriptionRef.current.style.opacity = showDescription ? "1" : "0";
    }
  );

  const descriptionWidth =
    screenState.orientation === "portrait" &&
    screenState.deviceClass === "small"
      ? viewport.width * viewport.factor * 0.8
      : viewport.width * viewport.factor * 0.5;

  const descriptionX =
    screenState.orientation === "portrait" &&
    screenState.deviceClass === "small"
      ? -viewport.width * 0.425
      : -viewport.width * 0.375;

  const descriptionY =
    screenState.orientation === "portrait"
      ? viewport.height * 0.4
      : viewport.height * 0.25;

  return (
    <group ref={groupRef}>
      <Html
        ref={descriptionRef}
        occlude
        style={{
          minWidth: size.width / 2,
          transition: "opacity 300ms",
          // backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
        className="portrait:rounded-2xl portrait:p-4 portrait:bg-white portrait:bg-opacity-90 portrait:backdrop-blur"
        position={[descriptionX, descriptionY, 0]}
        portal={{ current: htmlPortal }}
        distanceFactor={descriptionScaleFactor}
      >
        <ProjectDescription
          projectName="SongSpark"
          descriptionText="SongSpark inspires songwriters with generated melodies and chord progressions"
          url="https://songspark.bryanlindsey.dev"
          tags={[ReactTag]}
        />
      </Html>
      <Center
        position={[viewport.width / 5, 0, 0]}
        rotation={[Math.PI / 2, -0.25, 0.6]}
        scale={1.5}
      >
        <AcousticGuitar />
      </Center>
    </group>
  );
};
