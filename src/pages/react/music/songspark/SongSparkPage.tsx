import { Center, Html } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { Group, MathUtils, Vector3 } from "three";
import { useHtmlPortal } from "@hooks/useHtmlPortal";
import { useScreenState } from "@hooks/useScreenState";
import { useSpringScaleVisibility } from "@hooks/useSpringScaleVisibility";
import { PageComponentProps } from "@pages/Pages";
import {
  ProjectDescription,
  ReactTag,
  TailwindTag,
  TypescriptTag,
  WebAudioTag,
} from "@pages/components/ProjectDescription";
import { useScrollPages } from "@pages/useScrollPages";
import { AcousticGuitar } from "./AcousticGuitar";
import { KeyboardModel } from "./KeyboardModel";
import { ViolinModel } from "./ViolinModel";

const groupTargetPosition = new Vector3();

export const SongSparkPage = (props: PageComponentProps) => {
  const { startPageIndex, exitPageIndex } = props;
  const contentPageLength = exitPageIndex - startPageIndex;

  const groupRef = useRef<Group>(null);
  const htmlRef = useRef<Group>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const guitarRef = useRef<Group>(null);
  const keyboardRef = useRef<Group>(null);
  const violinRef = useRef<Group>(null);

  const screenState = useScreenState();
  const descriptionScaleFactor =
    screenState.deviceClass === "small" &&
    screenState.orientation === "landscape"
      ? 1.5
      : 2;

  const htmlPortal = useHtmlPortal();

  const { springValue, setVisibility } = useSpringScaleVisibility();

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
      setVisibility(showDescription);
      descriptionRef.current.style.scale = `${springValue.get()}`;
      descriptionRef.current.style.opacity = showDescription ? "1" : "0";
      descriptionRef.current.style.minWidth = `${state.size.width * 0.55}px`;

      const descriptionX =
        screenState.orientation === "portrait" &&
        screenState.deviceClass === "small"
          ? -state.viewport.width * 0.435
          : -state.viewport.width * 0.375;

      const descriptionY =
        screenState.orientation === "portrait"
          ? state.viewport.height * 0.4
          : state.viewport.height * 0.35;

      htmlRef.current?.position.set(descriptionX, descriptionY, 0);

      // Multiply by 2 here to account for the fact that parent group has stopped moving
      // - we double the speed here to keep it viusally constant
      // It might be better long-term to decouple this from the parent so I don't
      // have to do this
      const contentMovementAmount = contentPageLength * 2;
      const totalProgress =
        enterAmount +
        contentProgressAmount * contentMovementAmount +
        exitAmount;

      if (guitarRef.current !== null) {
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
      }

      const backgroundProgress = MathUtils.mapLinear(
        totalProgress,
        -1,
        1 + contentMovementAmount,
        -2,
        1.5
      );

      if (keyboardRef.current !== null) {
        const keyboardXOffset =
          screenState.deviceClass === "small" &&
          screenState.orientation === "landscape"
            ? state.viewport.width / 6
            : -state.viewport.width / 5;

        keyboardRef.current.position.set(
          keyboardXOffset,
          -state.viewport.height * 0.33 + backgroundProgress * 0.85,
          -2
        );

        keyboardRef.current.rotation.set(
          Math.PI / 2 - 0.2,
          0.25,
          backgroundProgress / 2 - 0.6
        );
      }

      if (violinRef.current !== null) {
        const violinXOffset =
          screenState.deviceClass === "small" &&
          screenState.orientation === "landscape"
            ? state.viewport.width / 4
            : -state.viewport.width * 0.2;

        violinRef.current.position.set(
          violinXOffset,
          state.viewport.height * 0.33 + backgroundProgress * 0.33,
          -1
        );

        violinRef.current.rotation.set(
          Math.PI * 0.15 * backgroundProgress,
          0.25 * backgroundProgress + 0.25,
          0.5
        );
      }
    }
  );

  return (
    <group ref={groupRef}>
      <group ref={htmlRef}>
        <Html
          ref={descriptionRef}
          // center
          className="rounded-2xl p-6 sm:p-8 bg-white bg-opacity-80 backdrop-blur transition-opacity duration-300"
          portal={{ current: htmlPortal }}
          distanceFactor={descriptionScaleFactor}
        >
          <ProjectDescription
            projectName="SongSpark"
            descriptionText="Inspire your inner songwriter with generated melodies and chord progressions"
            url="https://songspark.bryanlindsey.dev"
            tags={[ReactTag, TypescriptTag, TailwindTag, WebAudioTag]}
          />
        </Html>
      </group>
      <Suspense fallback={null}>
        <Center scale={1.5} ref={violinRef}>
          <ViolinModel />
        </Center>
      </Suspense>
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
