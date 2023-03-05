import { Center, Html, Sphere, Text3D } from "@react-three/drei";
import { Size, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group, MathUtils } from "three";
import { ProjectDescription, ReactTag } from "../../../ProjectDescription";
import { useHtmlPortal } from "../../../useHtmlPortal";
import { useScreenState } from "../../../useScreenState";
import { PageComponentProps } from "../../Pages";
import { useScrollPages } from "../../useScrollPages";
import Font from "./Comfortaa_Bold.json";

const XPiece = { color: "red", shape: "x" } as const;
const OPiece = { color: "blue", shape: "o" } as const;
type PieceType = typeof XPiece | typeof OPiece;

interface PieceData {
  type: PieceType;
  positionFn: (viewport: Size) => number[];
  rotation: number[];
  scale: 0.33 | 0.75 | 1;
}

const pieces: PieceData[] = [
  {
    type: XPiece,
    positionFn: (viewport) => [-0.1, 1.75, -1.5],
    rotation: [-0.4, 0.07, 0.2],
    scale: 0.33,
  },
  {
    type: XPiece,
    positionFn: (viewport) => [-1.25, 0.5, -3],
    rotation: [-0.4, 0.07, 0.2],
    scale: 0.33,
  },
  {
    type: OPiece,
    positionFn: (viewport) => [-0.4, 0.4, -1.75],
    rotation: [-0.4, -0.7, -0.2],
    scale: 0.75,
  },
  {
    type: OPiece,
    positionFn: (viewport) => [-0.6, -0.7, 0.2],
    rotation: [-0.4, 0.7, 0.2],
    scale: 1,
  },
  {
    type: XPiece,
    positionFn: (viewport) => [-0.4, -1.4, -0.25],
    rotation: [-0.4, -0.7, -0.2],
    scale: 1,
  },
  {
    type: OPiece,
    positionFn: (viewport) => [-1.66, -1.75, -3],
    rotation: [0.4, 0.07, 0.2],
    scale: 0.33,
  },
];

export const TicTacToePage = (props: PageComponentProps) => {
  const htmlPortal = useHtmlPortal();
  const pageGroupRef = useRef<Group>(null);
  const descriptionGroupRef = useRef<Group>(null!);
  const piecesGroupRef = useRef<Group>(null!);

  const contentRef = useRef<HTMLDivElement>(null);

  const viewport = useThree((state) => state.viewport);

  const screenState = useScreenState();
  const descriptionScaleFactor =
    screenState.deviceClass === "small" &&
    screenState.orientation === "landscape"
      ? 1.5
      : 2;

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
          portal={{ current: htmlPortal }}
          position={[viewport.width / 4, 0, 0]}
          style={{
            width: (viewport.width * viewport.factor) / 2,
            transition: "opacity 300ms",
          }}
          distanceFactor={descriptionScaleFactor}
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
        {pieces.map(({ positionFn, rotation, scale, type }, index) => {
          const [posX, posY, posZ] = positionFn(viewport);
          const [rotX, rotY, rotZ] = rotation;
          return (
            <Center
              key={index}
              position={[posX, posY, posZ]}
              rotation={[rotX, rotY, rotZ]}
              scale={scale}
            >
              <Text3D font={Font}>
                {type.shape}
                <meshStandardMaterial color={type.color} />
              </Text3D>
            </Center>
          );
        })}
      </group>
    </group>
  );
};
