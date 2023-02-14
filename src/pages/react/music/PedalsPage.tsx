import { GradientTexture, Html, RoundedBox, Tube } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import {
  CatmullRomCurve3,
  DoubleSide,
  Group,
  MeshStandardMaterial,
  Vector2,
  Vector3,
} from "three";
import { ProjectDescription, ReactTag } from "../../../ProjectDescription";
import { useHtmlPortal } from "../../../useHtmlPortal";
import { PageComponentProps } from "../../Pages";
import { useScrollPages } from "../../useScrollPages";

const curve = new CatmullRomCurve3(
  [
    new Vector3(1.5, 0.5, -1),
    new Vector3(-0.5, 0.25, -0.5),
    new Vector3(1, 0, 0),
    new Vector3(-0.5, -0.25, 0.5),
  ],
  false,
  "catmullrom",
  0.8
);

export const PedalsPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);
  const textureRef = useRef<MeshStandardMaterial>(null!);

  const viewport = useThree((state) => state.viewport);
  const size = useThree((state) => state.size);

  const htmlPortal = useHtmlPortal();

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    ({ enterAmount, contentProgressAmount, exitAmount, state }) => {
      if (groupRef.current === null) return;

      const yPercent = enterAmount + exitAmount;

      textureRef.current.alphaMap?.offset.setY(contentProgressAmount - 0.5);

      const viewportHeight = state.viewport.height;
      groupRef.current.position.setY(yPercent * viewportHeight);
    }
  );

  return (
    <group ref={groupRef}>
      <Html
        transform
        style={{
          width: size.width / 2,
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
      <Tube args={[curve, 256, 0.02, 12]}>
        <meshStandardMaterial
          ref={textureRef}
          opacity={0.5}
          color={"dimgrey"}
          alphaTest={0.001}
          side={DoubleSide}
        >
          <GradientTexture
            rotation={Math.PI * 0.5}
            center={new Vector2(0.5, 0.5)}
            stops={[0, 0.499, 0.501, 1]}
            colors={["white", "white", "black", "black"]}
            attach="alphaMap"
          />
        </meshStandardMaterial>
      </Tube>
    </group>
  );
};
