import {
  ProjectDescription,
  ReactTag,
  TailwindTag,
  ThreeJsTag,
  TypescriptTag,
} from "@/components/ProjectDescription";
import { PageComponentProps } from "@/features/homepage/sections/Pages";
import { useScrollPages } from "@/features/homepage/sections/useScrollPages";
import { useHtmlPortal } from "@hooks/useHtmlPortal";
import { useScreenState } from "@hooks/useScreenState";
import { useSpringScaleVisibility } from "@hooks/useSpringScaleVisibility";
import { Html } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { Group } from "three";
import { D20Model } from "./D20Model";

export const RpgCampaignPage = (props: PageComponentProps) => {
  const htmlPortal = useHtmlPortal();
  const pageGroupRef = useRef<Group>(null);
  const descriptionGroupRef = useRef<Group>(null!);
  const piecesGroupRef = useRef<Group>(null!);

  const contentRef = useRef<HTMLDivElement>(null);

  const screenState = useScreenState();
  const descriptionScaleFactor =
    screenState.deviceClass === "small" &&
    screenState.orientation === "landscape"
      ? 1.25
      : 2;

  const { springValue, setVisibility } = useSpringScaleVisibility();

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

      const viewport = state.viewport;

      const descriptionWidth =
        screenState.orientation === "portrait" &&
        screenState.deviceClass === "small"
          ? viewport.width * viewport.factor * 0.8
          : screenState.deviceClass === "small"
          ? viewport.width * viewport.factor * 0.6
          : viewport.width * viewport.factor * 0.45;

      contentRef.current.style.width = `${descriptionWidth}px`;

      const [descriptionX, descriptionY] =
        screenState.orientation === "portrait" &&
        screenState.deviceClass === "small"
          ? [-viewport.width * 0.4, 0]
          : [0, viewport.height * 0.33];

      const descriptionScrollAmount = enterAmount + exitAmount;

      descriptionGroupRef.current.position.setX(descriptionX);
      descriptionGroupRef.current.position.setY(descriptionY);

      const showDescription = descriptionScrollAmount === 0;
      setVisibility(showDescription);
      contentRef.current.style.scale = `${springValue.get()}`;
      contentRef.current.style.opacity = showDescription ? "1" : "0";

      const piecesScrollAmount =
        2 * (enterAmount + contentProgressAmount * 0.5 + exitAmount);

      const viewportHeight = state.viewport.height;
      piecesGroupRef.current.position.setY(piecesScrollAmount * viewportHeight);
    }
  );

  return (
    <group ref={pageGroupRef}>
      <group ref={descriptionGroupRef}>
        <Html
          ref={contentRef}
          portal={{ current: htmlPortal }}
          className="rounded-2xl p-6 sm:p-8 bg-white/90 backdrop-blur transition-opacity duration-300"
          distanceFactor={descriptionScaleFactor}
        >
          <ProjectDescription
            projectName="RPG Campaign Generator"
            descriptionText="AI-powered RPG campaigns at the push of a button"
            tags={[ReactTag, TypescriptTag, TailwindTag]}
            url="https://tictactoeplus.bryanlindsey.dev/"
          />
        </Html>
      </group>
      <group ref={piecesGroupRef} scale={3}>
        <D20Model />
      </group>
    </group>
  );
};
