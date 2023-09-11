import { Center, Html, Text3D } from "@react-three/drei";
import { RootState, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import {
  CustomBlending,
  Group,
  MathUtils,
  MeshStandardMaterial,
  ZeroFactor,
} from "three";
import {
  ProjectDescription,
  ReactTag,
  ThreeJsTag,
  TypescriptTag,
} from "@pages/components/ProjectDescription";
import { useHtmlPortal } from "@hooks/useHtmlPortal";
import { useScreenState } from "@hooks/useScreenState";
import { useSpringScaleVisibility } from "@hooks/useSpringScaleVisibility";
import { PageComponentProps } from "@pages/Pages";
import { useScrollPages } from "@pages/useScrollPages";
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
    positionFn: () => [-0.1, 1.75, -1.5],
    rotation: [0.4, 0.07, -0.2],
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
  const materialRef = useRef<MeshStandardMaterial>(null!);

  const [rotX, rotY, rotZ] = rotation;
  useFrame((state) => {
    const [posX, posY, posZ] = positionFn(state);
    ref.current.position.set(posX, posY, posZ);
    const opacity =
      posZ >= -0.5 ? 1 : 1 - MathUtils.mapLinear(posZ, -0.5, -5, 0.1, 0.2);
    materialRef.current.opacity = opacity;
  });

  const bevelSegments = scale === 1 ? 4 : scale === 0.75 ? 2 : 0;
  const curveSegments = scale === 1 ? 26 : scale === 0.75 ? 20 : 4;

  return (
    <Center ref={ref} rotation={[rotX, rotY, rotZ]} scale={scale}>
      <Text3D
        font={Font as any}
        bevelEnabled
        bevelSize={0.01}
        bevelThickness={0.025}
        bevelSegments={bevelSegments}
        curveSegments={curveSegments}
      >
        {type.shape}
        <meshStandardMaterial
          ref={materialRef}
          color={type.color}
          roughness={0.5}
          transparent
          // side={FrontSide}
          blending={CustomBlending}
          blendDst={ZeroFactor}
          // blendSrc={SrcAlphaFactor}
        />
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
          className="rounded-2xl p-6 sm:p-8 bg-white bg-opacity-80 backdrop-blur transition-opacity duration-300"
          distanceFactor={descriptionScaleFactor}
        >
          <ProjectDescription
            projectName="Tic-Tac-Toe+"
            descriptionText="A unique twist on the classic game with an extra layer of strategy"
            tags={[ReactTag, TypescriptTag, ThreeJsTag]}
            url="https://tictactoeplus.bryanlindsey.dev/"
          />
        </Html>
      </group>
      <group ref={piecesGroupRef}>
        <Suspense fallback={null}>
          {pieces.map((piece, index) => (
            <DisplayPiece piece={piece} key={index} />
          ))}
        </Suspense>
      </group>
    </group>
  );
};
