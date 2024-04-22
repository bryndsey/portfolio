import { useHtmlPortal } from "@hooks/useHtmlPortal";
import { Html, ScreenSpace } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import { PageComponentProps } from "./Pages";
import { CtaFooter } from "../../components/CtaFooter";
import { useScrollPages } from "./useScrollPages";

export const LinksPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const htmlPortal = useHtmlPortal();

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
    <ScreenSpace depth={2}>
      <group ref={groupRef}>
        <Html ref={contentRef} fullscreen portal={{ current: htmlPortal }}>
          <CtaFooter />
        </Html>
      </group>
    </ScreenSpace>
  );
};
