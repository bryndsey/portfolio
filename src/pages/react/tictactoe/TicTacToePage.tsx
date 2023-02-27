import { Center, Html, Sphere, Text3D } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group, MathUtils } from "three";
import { ProjectDescription, ReactTag } from "../../../ProjectDescription";
import { useHtmlPortal } from "../../../useHtmlPortal";
import { PageComponentProps } from "../../Pages";
import { useScrollPages } from "../../useScrollPages";
import Font from "./Comfortaa_Bold.json";

export const TicTacToePage = (props: PageComponentProps) => {
  const htmlPortal = useHtmlPortal();
  const pageGroupRef = useRef<Group>(null);

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
          transition: "opacity 300ms",
        }}
      >
        <ProjectDescription
          projectName="Tic-Tac-Toe Plus"
          descriptionText="A strategic twist on the classic game. Use differently-sized X's and O's to steal your opponents square."
          tags={[ReactTag]}
          url="https://tictactoeplus.bryanlindsey.dev/"
        />
      </Html>
      <Center position={[-0.4, -0.4, -0.75]} rotation={[-0.4, -0.7, -0.2]}>
        <Text3D font={Font}>
          x
          <meshStandardMaterial color={"red"} flatShading={false} />
        </Text3D>
      </Center>
      <Center position={[-0.6, 0.3, 0.1]} rotation={[-0.4, 0.7, 0.2]}>
        <Text3D font={Font}>
          o
          <meshStandardMaterial color={"blue"} />
        </Text3D>
      </Center>
    </group>
  );
};
