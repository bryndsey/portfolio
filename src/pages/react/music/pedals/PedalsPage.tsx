import {
  Cylinder,
  GradientTexture,
  Html,
  Mask,
  RoundedBox,
  Tube,
  useMask,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import {
  CatmullRomCurve3,
  Color,
  DoubleSide,
  Euler,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Vector2,
  Vector3,
} from "three";
import { ProjectDescription, ReactTag } from "../../../../ProjectDescription";
import { useHtmlPortal } from "../../../../useHtmlPortal";
import { PageComponentProps } from "../../../Pages";
import { useScrollPages } from "../../../useScrollPages";

const cableColor = new Color(0.03, 0.03, 0.03);

const cableEndRotation = new Euler(Math.PI / 2, 0, 0);

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

  const curve = new CatmullRomCurve3(
    [
      new Vector3(viewport.width, 1, -1),
      new Vector3(-0.75, 0.5, -0.25),
      new Vector3(0.75, -0.1, 0.5),
      new Vector3(-viewport.width / 7 + 0.1, -0.1, 1),
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

      const cableProgress = MathUtils.mapLinear(
        enterAmount + contentProgressAmount,
        -1,
        1,
        0,
        1
      );

      const cableTextureOffset = cableProgress - 0.5;
      textureRef.current.alphaMap?.offset.setY(cableTextureOffset);

      const pointPosition = curve.getPointAt(cableProgress);
      const pointTangent = curve.getTangentAt(cableProgress);
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
          width: size.width / 2,
          transition: "opacity 300ms",
          // backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
        position={[viewport.width / 4, viewport.height / 5, 0]}
        portal={{ current: htmlPortal }}
        distanceFactor={1}
      >
        <ProjectDescription
          projectName="Pedals"
          descriptionText="Build your own digital pedal board to add effects for guitar"
          tags={[ReactTag]}
        />
      </Html>
      <group position={[-viewport.width / 7, -0.1, 1]} rotation={[2, 0, -0.6]}>
        <RoundedBox args={[0.2, 0.4, 0.1]} radius={0.01}>
          <meshStandardMaterial color={"firebrick"} />
        </RoundedBox>
      </group>
      <Tube args={[curve, 256, 0.02, 12]} ref={cableRef}>
        <meshStandardMaterial
          ref={textureRef}
          opacity={0.5}
          color={cableColor}
          alphaTest={0.001}
          side={DoubleSide}
          roughness={0.6}
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
      <group ref={cableEnd}>
        <Cylinder args={[0.04, 0.04, 0.1]} rotation={cableEndRotation}>
          <meshStandardMaterial color={"grey"} roughness={0} />
        </Cylinder>
        <Cylinder
          args={[0.02, 0.02, 0.1]}
          position={[0, 0, 0.1]}
          rotation={cableEndRotation}
        >
          <meshStandardMaterial color={"grey"} roughness={0} />
        </Cylinder>
      </group>
    </group>
  );
};
