import { Center, Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Group, MathUtils, Vector3 } from "three";
import { ProjectDescription, ReactTag } from "../../../../ProjectDescription";
import { useHtmlPortal } from "../../../../useHtmlPortal";
import { useScreenState } from "../../../../useScreenState";
import { PageComponentProps } from "../../../Pages";
import { useScrollPages } from "../../../useScrollPages";
import { AcousticGuitar } from "./AcousticGuitar";
import { KeyboardModel } from "./KeyboardModel";

const groupTargetPosition = new Vector3();

export const SongSparkPage = (props: PageComponentProps) => {
  const { startPageIndex, exitPageIndex } = props;
  const contentPageLength = exitPageIndex - startPageIndex;

  const groupRef = useRef<Group>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const guitarRef = useRef<Group>(null!);
  const keyboardRef = useRef<Group>(null!);

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
    startPageIndex,
    exitPageIndex,
    ({
      enterAmount,
      exitAmount,
      contentProgressAmount,
      isPageVisible,
      state,
    }) => {
      if (groupRef.current === null) return;
      groupRef.current.visible = isPageVisible;

      if (descriptionRef.current === null) return;
      descriptionRef.current.hidden = !isPageVisible;

      const viewportHeight = state.viewport.height;
      const yPercent = enterAmount + exitAmount;
      groupTargetPosition.setY(yPercent * viewportHeight);

      if (!isPageVisible) {
        // If not visible, immediately move to target so we don't have any weird movement
        // when it does become visible
        groupRef.current.position.set(
          groupTargetPosition.x,
          groupTargetPosition.y,
          groupTargetPosition.z
        );
        return;
      }

      groupRef.current.position.lerp(groupTargetPosition, 0.25);

      const showDescription = yPercent === 0;
      descriptionRef.current.style.opacity = showDescription ? "1" : "0";

      // Multiply by 2 here to account for the fact that parent group has stopped moving
      // - we double the speed here to keep it viusally constant
      // It might be better long-term to decouple this from the parent so I don't
      // have to do this
      const contentMovementAmount = contentPageLength * 2;
      const totalProgress =
        enterAmount +
        contentProgressAmount * contentMovementAmount +
        exitAmount;

      const guitarXOffset =
        screenState.deviceClass === "small" &&
        screenState.orientation === "landscape"
          ? state.viewport.width / 3
          : state.viewport.width / 4;

      guitarRef.current.position.setX(guitarXOffset);

      guitarRef.current.rotation.set(
        Math.PI / 2 + totalProgress / 50,
        -0.25,
        0.75 - totalProgress / 20
      );

      const keyboardXOffset =
        screenState.deviceClass === "small" &&
        screenState.orientation === "landscape"
          ? state.viewport.width / 6
          : -state.viewport.width / 5;

      const keyboardProgress = MathUtils.mapLinear(
        totalProgress,
        -1,
        1 + contentMovementAmount,
        -3,
        2
      );
      keyboardRef.current.position.set(
        keyboardXOffset,
        -state.viewport.height * 0.25 + keyboardProgress,
        -1.5
      );

      keyboardRef.current.rotation.set(
        Math.PI / 2 - 0.2,
        0.25,
        keyboardProgress / 2 - 0.6
      );
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
          descriptionText="Inspire your inner songwriter with generated melodies and chord progressions"
          url="https://songspark.bryanlindsey.dev"
          tags={[ReactTag]}
        />
      </Html>
      <Suspense fallback={null}>
        <Center scale={1.5} ref={guitarRef}>
          <AcousticGuitar />
        </Center>
      </Suspense>
      <Suspense fallback={null}>
        <Center scale={1.5} ref={keyboardRef}>
          <KeyboardModel />
        </Center>
      </Suspense>
    </group>
  );
};
