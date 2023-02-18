import { Html } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import { ProjectDescription, ReactTag } from "../../../ProjectDescription";
import { useHtmlPortal } from "../../../useHtmlPortal";
import { PageComponentProps } from "../../Pages";
import { useScrollPages } from "../../useScrollPages";

export const ChoresPage = (props: PageComponentProps) => {
  const htmlPortal = useHtmlPortal();
  const groupRef = useRef<Group>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    ({ enterAmount, exitAmount, isPageVisible, state }) => {
      if (groupRef.current === null) return;

      groupRef.current.visible = isPageVisible;

      if (contentRef.current === null) return;
      contentRef.current.hidden = !isPageVisible;

      const yPercent = enterAmount + exitAmount;

      const viewportHeight = state.viewport.height;
      groupRef.current.position.setY(yPercent * viewportHeight);
    }
  );

  return (
    <group ref={groupRef}>
      <Html
        ref={contentRef}
        transform
        portal={{ current: htmlPortal }}
        distanceFactor={1}
      >
        <ProjectDescription
          projectName="Chore Chart"
          descriptionText="A chart for keeping track of weekly chores in your household"
          tags={[ReactTag]}
          url="https://chores.bryanlindsey.dev/"
        />
      </Html>
    </group>
  );
};
