import { GradientTexture, Html, Tube } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import {
  CatmullRomCurve3,
  Color,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Vector2,
  Vector3,
} from "three";
import { useCameraFrustumWidthAtDepth } from "../../../../utils";
import { ProjectDescription, ReactTag } from "../../../../ProjectDescription";
import { useHtmlPortal } from "../../../../useHtmlPortal";
import { PageComponentProps } from "../../../Pages";
import { useScrollPages } from "../../../useScrollPages";
import { CablePlugModel } from "./CablePlugModel";
import { PedalModel } from "./PedalModel";
import { useScreenState } from "../../../../useScreenState";

const cableColor = new Color(0.03, 0.03, 0.03);

const textureCenter = new Vector2(0.5, 0.5);

const groupTargetPosition = new Vector3();

export const PedalsPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);
  const cableRef = useRef<Mesh>(null!);
  const cableEnd = useRef<Group>(null!);
  const textureRef = useRef<MeshStandardMaterial>(null!);

  const descriptionRef = useRef<HTMLDivElement>(null);

  const viewport = useThree((state) => state.viewport);
  const size = useThree((state) => state.size);

  const htmlPortal = useHtmlPortal();

  const curveStartDepth = -0.5;
  const curve = new CatmullRomCurve3(
    [
      new Vector3(
        -useCameraFrustumWidthAtDepth(curveStartDepth) / 2 - 1,
        1.25,
        curveStartDepth
      ),
      new Vector3(viewport.width * 0.4, 0.5, -0.1),
      new Vector3(viewport.width / 7 - 1.25, -0.1, 0.1),
      new Vector3(viewport.width / 7 - 0.25, -0.175, 0.75),
    ],
    false,
    "catmullrom",
    0.75
  );

  const screenState = useScreenState();
  const descriptionScaleFactor =
    screenState.deviceClass === "small" &&
    screenState.orientation === "landscape"
      ? 1.5
      : 2;

  const descriptionWidth =
    screenState.orientation === "portrait" &&
    screenState.deviceClass === "small"
      ? size.width * 0.8
      : size.width * 0.5;

  const [descriptionX, descriptionY] =
    screenState.orientation === "portrait" &&
    screenState.deviceClass === "small"
      ? [0, viewport.height * 0.25]
      : [-viewport.width * 0.15, viewport.height * 0.2];

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    ({
      enterAmount,
      contentProgressAmount,
      exitAmount,
      isPageVisible,
      state,
    }) => {
      if (groupRef.current === null) return;

      groupRef.current.visible = isPageVisible;

      if (descriptionRef.current === null) return;
      descriptionRef.current.hidden = !isPageVisible;

      const yPercent = enterAmount + exitAmount;

      const viewportHeight = state.viewport.height;
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

      const cableAnimationFinishPercent = 0.9;
      const cableProgressPercent = MathUtils.mapLinear(
        Math.min(
          enterAmount + contentProgressAmount,
          cableAnimationFinishPercent
        ),
        -1,
        cableAnimationFinishPercent,
        0,
        1
      );

      const curveLengths = curve.getLengths();
      const targetLengthIndex = Math.min(
        Math.ceil(curveLengths.length * cableProgressPercent),
        curveLengths.length - 1
      );
      const targetLength = curveLengths[targetLengthIndex];

      const cableTextureOffset = targetLength / curve.getLength() - 0.5;

      textureRef.current.alphaMap?.offset.setY(cableTextureOffset);

      const pointPosition = curve.getPoint(cableProgressPercent);
      const pointTangent = curve.getTangent(cableProgressPercent);
      cableEnd.current.position.set(
        pointPosition.x,
        pointPosition.y,
        pointPosition.z
      );

      const rotationTarget = cableRef.current.localToWorld(
        pointTangent.add(pointPosition)
      );
      cableEnd.current.lookAt(rotationTarget);

      const showContent =
        contentProgressAmount > 0 && contentProgressAmount < 1;
      descriptionRef.current.style.opacity = showContent ? "1" : "0";
    }
  );

  return (
    <group ref={groupRef}>
      <Html
        ref={descriptionRef}
        center
        style={{
          width: descriptionWidth,
          transition: "opacity 300ms",
          // backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
        className="portrait:rounded-2xl portrait:p-4 portrait:bg-white portrait:bg-opacity-90 portrait:backdrop-blur"
        position={[descriptionX, descriptionY, 0]}
        portal={{ current: htmlPortal }}
        distanceFactor={descriptionScaleFactor}
      >
        <ProjectDescription
          projectName="Pedals"
          descriptionText="Create a virtual pedal board of effects for guitar"
          url="https://pedals.bryanlindsey.dev"
          tags={[ReactTag]}
        />
      </Html>
      <Suspense fallback={null}>
        <group
          position={[viewport.width / 7, -0.2, 1]}
          rotation={[1, -0.4, 0.5]}
          scale={4}
        >
          <PedalModel />
        </group>
        <Tube args={[curve, 256, 0.02, 12]} ref={cableRef}>
          <meshStandardMaterial
            ref={textureRef}
            opacity={0.5}
            color={cableColor}
            alphaTest={0.001}
            side={DoubleSide}
            roughness={0.8}
          >
            <GradientTexture
              rotation={Math.PI * 0.5}
              center={textureCenter}
              stops={[0, 0.499, 0.501, 1]}
              colors={["white", "white", "black", "black"]}
              attach="alphaMap"
            />
          </meshStandardMaterial>
        </Tube>
        <group ref={cableEnd} scale={7}>
          <CablePlugModel />
        </group>
      </Suspense>
    </group>
  );
};
