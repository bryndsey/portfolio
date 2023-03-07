import { Center, Html, Text3D } from "@react-three/drei";
import { RootState, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
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
  positionFn: (state: RootState) => number[];
  rotation: number[];
  scale: 0.33 | 0.75 | 1;
}

const pieces: PieceData[] = [
  {
    type: XPiece,
    positionFn: (state) => [-0.1, 1.75, -1.5],
    rotation: [-0.4, 0.07, 0.2],
    scale: 0.33,
  },
  {
    type: XPiece,
    positionFn: (state) => [-state.viewport.width * 0.66, 0.5, -3],
    rotation: [-0.4, 0.07, 0.2],
    scale: 0.33,
  },
  {
    type: OPiece,
    positionFn: (state) => [-state.viewport.width * 0.15, 0.4, -1.75],
    rotation: [-0.4, -0.7, -0.2],
    scale: 0.75,
  },
  {
    type: OPiece,
    positionFn: (state) => [-state.viewport.width * 0.2 - 0.1, -0.8, 0.2],
    rotation: [-0.4, 0.7, 0.2],
    scale: 1,
  },
  {
    type: XPiece,
    positionFn: (state) => [-state.viewport.width * 0.2 + 0.1, -1.4, -0.25],
    rotation: [-0.4, -0.7, -0.2],
    scale: 1,
  },
  {
    type: OPiece,
    positionFn: (state) => {
      const xPosition = -state.viewport.width / 2;
      return [xPosition, -1.75, -3];
    },
    rotation: [0.4, 0.07, 0.2],
    scale: 0.33,
  },
];

interface DisplayPieceProps {
  piece: PieceData;
}

const DisplayPiece = ({ piece }: DisplayPieceProps) => {
  const { positionFn, rotation, scale, type } = piece;
  const ref = useRef<Group>(null!);

  const [rotX, rotY, rotZ] = rotation;
  useFrame((state) => {
    const [posX, posY, posZ] = positionFn(state);
    ref.current.position.set(posX, posY, posZ);
  });

  return (
    <Center ref={ref} rotation={[rotX, rotY, rotZ]} scale={scale}>
      <Text3D
        font={Font}
        bevelEnabled
        bevelSize={0.01}
        bevelThickness={0.025}
        bevelSegments={6}
        curveSegments={32}
      >
        {type.shape}
        <meshStandardMaterial color={type.color} roughness={0.5} />
      </Text3D>
    </Center>
  );
};

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

  const descriptionWidth =
    screenState.orientation === "portrait" &&
    screenState.deviceClass === "small"
      ? viewport.width * viewport.factor * 0.8
      : viewport.width * viewport.factor * 0.45;

  const [descriptionX, descriptionY] =
    screenState.orientation === "portrait" &&
    screenState.deviceClass === "small"
      ? [0, viewport.height * -0.2]
      : [viewport.width * 0.2, 0];

  return (
    <group ref={pageGroupRef}>
      <group ref={descriptionGroupRef}>
        <Html
          ref={contentRef}
          center
          portal={{ current: htmlPortal }}
          position={[descriptionX, descriptionY, 0]}
          style={{
            width: descriptionWidth,
            transition: "opacity 300ms",
          }}
          className="portrait:rounded-2xl portrait:p-4 portrait:bg-white portrait:bg-opacity-90 portrait:backdrop-blur"
          distanceFactor={descriptionScaleFactor}
        >
          <ProjectDescription
            projectName="Tic-Tac-Toe+"
            descriptionText="A unique twist on the classic game that adds a layer of strategy"
            tags={[ReactTag]}
            url="https://tictactoeplus.bryanlindsey.dev/"
          />
        </Html>
      </group>
      <group ref={piecesGroupRef}>
        {pieces.map((piece, index) => (
          <DisplayPiece piece={piece} key={index} />
        ))}
      </group>
    </group>
  );
};
