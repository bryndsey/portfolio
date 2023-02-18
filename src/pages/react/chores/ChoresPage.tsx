import { Html, Sphere } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group, MathUtils } from "three";
import { ProjectDescription, ReactTag } from "../../../ProjectDescription";
import { useHtmlPortal } from "../../../useHtmlPortal";
import { PageComponentProps } from "../../Pages";
import { useScrollPages } from "../../useScrollPages";
import { GarbageCanModel } from "./GarbageCanModel";

export const ChoresPage = (props: PageComponentProps) => {
  const htmlPortal = useHtmlPortal();
  const pageGroupRef = useRef<Group>(null);
  const bagRef = useRef<Group>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const viewport = useThree((state) => state.viewport);

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    ({
      enterAmount,
      exitAmount,
      contentProgressAmount,
      isPageVisible,
      state,
    }) => {
      if (pageGroupRef.current === null) return;

      pageGroupRef.current.visible = isPageVisible;

      if (contentRef.current === null) return;
      contentRef.current.hidden = !isPageVisible;

      const yPercent = enterAmount + exitAmount;

      const viewportHeight = state.viewport.height;
      pageGroupRef.current.position.setY(yPercent * viewportHeight);

      if (bagRef.current === null) return;
      const bagYPosition = MathUtils.lerp(0.66, 0, contentProgressAmount);
      bagRef.current.position.setY(bagYPosition);
    }
  );

  return (
    <group ref={pageGroupRef}>
      <Html
        ref={contentRef}
        transform
        portal={{ current: htmlPortal }}
        distanceFactor={1}
        position={[viewport.width / 4, 0, 0]}
        style={{ width: (viewport.width * viewport.factor) / 2 }}
      >
        <ProjectDescription
          projectName="Chore Chart"
          descriptionText="A chart for keeping track of weekly chores in your household"
          tags={[ReactTag]}
          url="https://chores.bryanlindsey.dev/"
        />
      </Html>
      <group position={[-viewport.width / 4, 0, -0.25]}>
        <group scale={0.66} rotation={[0.1, 0, 0]}>
          <GarbageCanModel />
        </group>
        <group ref={bagRef}>
          <Sphere args={[0.3]}>
            <meshStandardMaterial color={"black"} roughness={0.2} />
          </Sphere>
        </group>
      </group>
    </group>
  );
};
