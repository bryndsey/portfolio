import { Html, Tube } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import {
  CatmullRomCurve3,
  Color,
  DataTexture,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  NearestFilter,
  Vector2,
  Vector3,
} from "three";
import {
  KonvaTag,
  ProjectDescription,
  ReactTag,
  TypescriptTag,
  WebAudioTag,
} from "../../../components/ProjectDescription";
import { useHtmlPortal } from "../../../../hooks/useHtmlPortal";
import { useScreenState } from "../../../../hooks/useScreenState";
import { useSpringScaleVisibility } from "../../../../hooks/useSpringScaleVisibility";
import { useCameraFrustumWidthAtDepth } from "../../../utils";
import { PageComponentProps } from "../../../Pages";
import { useScrollPages } from "../../../useScrollPages";
import { CablePlugModel } from "./CablePlugModel";
import { PedalModel } from "./PedalModel";

const cableColor = new Color(0.03, 0.03, 0.03);

const textureCenter = new Vector2(0.5, 0.5);

const groupTargetPosition = new Vector3();

const textureData = new Uint8Array([255, 255, 255, 255, 0, 0, 0, 255]);
const texture = new DataTexture(textureData, 2, 1);
texture.magFilter = NearestFilter;
texture.minFilter = NearestFilter;
texture.needsUpdate = true;

export const PedalsPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);
  const cableRef = useRef<Mesh>(null);
  const cableEnd = useRef<Group>(null);
  const textureRef = useRef<MeshStandardMaterial>(null);

  const descriptionGroupRef = useRef<Group>(null!);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const viewport = useThree((state) => state.viewport);

  const htmlPortal = useHtmlPortal();

  const curveStartDepth = -0.5;
  const curve = new CatmullRomCurve3(
    [
      new Vector3(
        -useCameraFrustumWidthAtDepth(viewport, curveStartDepth) / 2 - 1,
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

  const { springValue, setVisibility } = useSpringScaleVisibility();

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

      // textureRef.current.alphaMap?.offset.setY(cableTextureOffset);
      if (cableTextureOffset !== texture.offset.x) {
        texture.offset.setX(-cableTextureOffset);
        texture.needsUpdate = true;
      }

      if (cableEnd.current !== null) {
        const pointPosition = curve.getPoint(cableProgressPercent);
        const pointTangent = curve.getTangent(cableProgressPercent);
        cableEnd.current.position.set(
          pointPosition.x,
          pointPosition.y,
          pointPosition.z
        );

        if (cableRef.current !== null) {
          const rotationTarget = cableRef.current.localToWorld(
            pointTangent.add(pointPosition)
          );
          cableEnd.current.lookAt(rotationTarget);
        }
      }

      const showContent =
        contentProgressAmount > 0 && contentProgressAmount < 1;
      setVisibility(showContent);
      descriptionRef.current.style.scale = `${springValue.get()}`;
      descriptionRef.current.style.opacity = showContent ? "1" : "0";

      const descriptionWidth =
        screenState.orientation === "portrait" &&
        screenState.deviceClass === "small"
          ? state.size.width * 0.8
          : state.size.width * 0.5;

      descriptionRef.current.style.width = `${descriptionWidth}px`;

      const [descriptionX, descriptionY] =
        screenState.orientation === "portrait" &&
        screenState.deviceClass === "small"
          ? [-viewport.width * 0.4, viewport.height * 0.45]
          : [-viewport.width * 0.4, viewport.height * 0.4];

      descriptionGroupRef.current.position.set(descriptionX, descriptionY, 0);
    }
  );

  return (
    <group ref={groupRef}>
      <group ref={descriptionGroupRef}>
        <Html
          ref={descriptionRef}
          className="rounded-2xl p-6 sm:p-8 bg-white bg-opacity-80 backdrop-blur transition-opacity duration-300"
          portal={{ current: htmlPortal }}
          distanceFactor={descriptionScaleFactor}
        >
          <ProjectDescription
            projectName="Pedals"
            descriptionText="Create a virtual pedal board of effects for guitar"
            url="https://pedals.bryanlindsey.dev"
            tags={[ReactTag, TypescriptTag, WebAudioTag, KonvaTag]}
          />
        </Html>
      </group>
      <Suspense fallback={null}>
        <group
          position={[viewport.width / 7, -0.2, 1]}
          rotation={[1, -0.4, 0.5]}
          scale={4}
        >
          <PedalModel />
        </group>
        <Tube args={[curve, 256, 0.02, 4]} ref={cableRef}>
          <meshStandardMaterial
            ref={textureRef}
            opacity={0.5}
            color={cableColor}
            alphaTest={0.001}
            roughness={0.8}
          >
            <primitive
              dispose={null}
              object={texture}
              attach="alphaMap"
              center={textureCenter}
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
