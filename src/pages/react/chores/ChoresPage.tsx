import { Html, Sphere } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group, MathUtils } from "three";
import {
  ProjectDescription,
  ReactTag,
} from "@pages/components/ProjectDescription";
import { useHtmlPortal } from "@hooks/useHtmlPortal";
import { PageComponentProps } from "@pages/Pages";
import { useScrollPages } from "@pages/useScrollPages";
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

      const showDescription = yPercent === 0;
      contentRef.current.style.opacity = showDescription ? "1" : "0";
    }
  );

  return (
    <group ref={pageGroupRef}>
      <Html
        ref={contentRef}
        center
        occlude
        portal={{ current: htmlPortal }}
        position={[viewport.width / 4, 0, 0]}
        style={{
          width: (viewport.width * viewport.factor) / 2,
        }}
        className="transition-opacity duration-300"
      >
        <ProjectDescription
          projectName="Chore Chart"
          descriptionText="An app to keep track of weekly chores in your household"
          tags={[ReactTag]}
          url="https://chores.bryanlindsey.dev/"
        />
      </Html>
      <group position={[-viewport.width / 4, -0.25, 0]}>
        <group scale={0.6} rotation={[0.1, 0, 0]}>
          <GarbageCanModel />
        </group>
        <group ref={bagRef}>
          <Sphere args={[0.25]}>
            <meshStandardMaterial color={"black"} roughness={0.2} />
          </Sphere>
        </group>
      </group>
    </group>
  );
};
