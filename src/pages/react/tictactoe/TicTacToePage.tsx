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
  const descriptionGroupRef = useRef<Group>(null!);
  const piecesGroupRef = useRef<Group>(null!);

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

      const descriptionScrollAmount = enterAmount + exitAmount;

      const viewportHeight = state.viewport.height;
      descriptionGroupRef.current.position.setY(
        descriptionScrollAmount * viewportHeight
      );

      const showDescription = descriptionScrollAmount === 0;
      contentRef.current.style.opacity = showDescription ? "1" : "0";

      const piecesScrollAmount =
        2 * (enterAmount + contentProgressAmount * 0.5 + exitAmount);

      piecesGroupRef.current.position.setY(piecesScrollAmount * viewportHeight);
    }
  );

  return (
    <group ref={pageGroupRef}>
      <group ref={descriptionGroupRef}>
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
      </group>
      <group ref={piecesGroupRef}>
        <Center
          position={[-0.1, 1.75, -1.5]}
          rotation={[-0.4, 0.07, 0.2]}
          scale={0.33}
        >
          <Text3D font={Font}>
            x
            <meshStandardMaterial color={"red"} />
          </Text3D>
        </Center>
        <Center
          position={[-1.25, 0.5, -3]}
          rotation={[-0.4, 0.07, 0.2]}
          scale={0.33}
        >
          <Text3D font={Font}>
            x
            <meshStandardMaterial color={"red"} />
          </Text3D>
        </Center>
        <Center
          position={[-0.4, 0.4, -1.75]}
          rotation={[-0.4, -0.7, -0.2]}
          scale={0.75}
        >
          <Text3D font={Font}>
            o
            <meshStandardMaterial color={"blue"} flatShading={false} />
          </Text3D>
        </Center>
        <Center position={[-0.6, -0.7, 0.2]} rotation={[-0.4, 0.7, 0.2]}>
          <Text3D font={Font}>
            o
            <meshStandardMaterial color={"blue"} />
          </Text3D>
        </Center>
        <Center position={[-0.4, -1.4, -0.25]} rotation={[-0.4, -0.7, -0.2]}>
          <Text3D font={Font}>
            x
            <meshStandardMaterial color={"red"} flatShading={false} />
          </Text3D>
        </Center>
        <Center
          position={[-1.66, -1.75, -3]}
          rotation={[0.4, 0.07, 0.2]}
          scale={0.33}
        >
          <Text3D font={Font}>
            o
            <meshStandardMaterial color={"blue"} />
          </Text3D>
        </Center>
      </group>
    </group>
  );
};
