import { GradientTexture, Html, Tube } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
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

const cableColor = new Color(0.03, 0.03, 0.03);

const textureCenter = new Vector2(0.5, 0.5);

export const PedalsPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);
  const cableRef = useRef<Mesh>(null!);
  const cableEnd = useRef<Group>(null!);
  const textureRef = useRef<MeshStandardMaterial>(null!);

  const descriptionRef = useRef<HTMLDivElement>(null);

  const viewport = useThree((state) => state.viewport);
  const size = useThree((state) => state.size);

  const htmlPortal = useHtmlPortal();

  const curveStartDepth = -1;
  const curve = new CatmullRomCurve3(
    [
      new Vector3(
        useCameraFrustumWidthAtDepth(curveStartDepth) / 2 + 1,
        1,
        curveStartDepth
      ),
      new Vector3(-0.75, 0.5, -0.25),
      new Vector3(0.8, -0.175, 0.25),
      new Vector3(-viewport.width / 7 + 0.3, -0.175, 0.85),
    ],
    false,
    "catmullrom",
    0.75
  );

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    ({ enterAmount, contentProgressAmount, exitAmount, state }) => {
      if (groupRef.current === null) return;

      const yPercent = enterAmount + exitAmount;

      const viewportHeight = state.viewport.height;
      groupRef.current.position.setY(yPercent * viewportHeight);

      const cableProgressPercent = MathUtils.mapLinear(
        enterAmount + contentProgressAmount,
        -1,
        1,
        0,
        1
      );

      const curveLengths = curve.getLengths();
      const targetLengthIndex = Math.ceil(
        curveLengths.length * cableProgressPercent
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

      if (descriptionRef.current === null) return;
      const showContent =
        contentProgressAmount > 0 && contentProgressAmount < 1;
      descriptionRef.current.style.opacity = showContent ? "1" : "0";
    }
  );

  return (
    <group ref={groupRef}>
      <Html
        ref={descriptionRef}
        transform
        style={{
          width: size.width * 0.5,
          transition: "opacity 300ms",
          // backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
        position={[viewport.width / 5, viewport.height / 6, 0]}
        portal={{ current: htmlPortal }}
        distanceFactor={1}
      >
        <ProjectDescription
          projectName="Pedals"
          descriptionText="Build your own digital pedal board to add effects for guitar"
          url="https://pedals.bryanlindsey.dev"
          tags={[ReactTag]}
        />
      </Html>
      <group
        position={[-viewport.width / 7, -0.2, 1]}
        rotation={[1, 0.4, -0.5]}
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
    </group>
  );
};
