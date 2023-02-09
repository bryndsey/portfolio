import { Html, RoundedBox } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import { ProjectDescription, ReactTag } from "../../../ProjectDescription";
import { useHtmlPortal } from "../../../useHtmlPortal";
import { PageComponentProps } from "../../Pages";
import { useScrollPages } from "../../useScrollPages";

export const PedalsPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);

  const viewport = useThree((state) => state.viewport);
  const size = useThree((state) => state.size);

  const htmlPortal = useHtmlPortal();

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    (enterAmount, exitAmount, state, delta) => {
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
        style={{
          width: size.width / 2,
          // backgroundColor: "rgba(0, 0, 0, 0.2)",
          fontSize: size.width / 50,
        }}
        // fontSize={0.15}
        position={[viewport.width / 4, viewport.height / 5, 0]}
        portal={{ current: htmlPortal }}
        distanceFactor={1}
      >
        <ProjectDescription
          projectName="Pedals"
          descriptionText="TODO: Describe this project"
          tags={[ReactTag]}
        />
      </Html>
      <group position={[-viewport.width / 7, -0.1, 1]} rotation={[2, 0, -0.6]}>
        <RoundedBox args={[0.2, 0.4, 0.1]} radius={0.01}>
          <meshStandardMaterial color={"firebrick"} />
        </RoundedBox>
      </group>
    </group>
  );
};
