import { Billboard, Float, Html, Text } from "@react-three/drei";
import { RootState, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Group, MathUtils, Vector3 } from "three";
import { useHtmlPortal } from "../useHtmlPortal";
import { PageComponentProps } from "./Pages";
import { useScrollPages } from "./useScrollPages";

interface ThingIMake {
  name: string;
  positionFn: (state: RootState) => number[];
}

const newListOfThingsIMake: ThingIMake[] = [
  {
    name: "React apps",
    positionFn: (state) => [
      state.viewport.width * 0.1,
      state.viewport.height * 0.1,
      0.3,
    ],
  },
  {
    name: "Music",
    positionFn: (state) => [
      state.viewport.width * -0.25,
      state.viewport.height * 0.2,
      0.1,
    ],
  },
  {
    name: "3D models",
    positionFn: (state) => [
      state.viewport.width * 0.3,
      state.viewport.height * -0.175,
      -0.1,
    ],
  },
  {
    name: "Games",
    positionFn: (state) => [0, state.viewport.height * -0.3, 0.05],
  },
  {
    name: "Android apps",
    positionFn: (state) => [
      state.viewport.width * -0.25,
      state.viewport.height * -0.1,
      -0.35,
    ],
  },
];

const FloatingThing = (props: { thing: ThingIMake }) => {
  const { thing } = props;

  const htmlPortal = useHtmlPortal();
  const groupRef = useRef<Group>(null!);
  const htmlRef = useRef<HTMLDivElement>(null!);

  useFrame((state) => {
    const position = thing.positionFn(state);
    groupRef.current.position.set(position[0], position[1], position[2]);

    htmlRef.current.style.opacity = `${MathUtils.mapLinear(
      position[2],
      -3,
      1,
      0,
      1
    )}`;
  });

  return (
    <group ref={groupRef}>
      <Html
        ref={htmlRef}
        transform
        portal={{ current: htmlPortal }}
        distanceFactor={1}
      >
        <p className="text-2xl sm:text-4xl md:text-6xl font-bold whitespace-nowrap">
          {thing.name}
        </p>
      </Html>
    </group>
  );
};

export const AboutPage = (props: PageComponentProps) => {
  const htmlPortal = useHtmlPortal();
  const groupRef = useRef<Group>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wordCloudGroupRef = useRef<Group>(null!);

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
    <Suspense fallback={null}>
      <group ref={groupRef}>
        <Html
          ref={contentRef}
          fullscreen
          portal={{ current: htmlPortal }}
          zIndexRange={[0, 0]}
        >
          <div className="h-full w-full flex flex-col justify-between m-auto px-4 py-8">
            <p className="font-semibold text-5xl md:text-7xl font-handwritten text-center">
              I like to make things.
            </p>
            <p className="text-xl md:text-4xl text-center font-handwritten">
              {"Keep scrolling to see some things I've made."}
            </p>
          </div>
        </Html>
        <group ref={wordCloudGroupRef}>
          {newListOfThingsIMake.map((thing) => (
            <FloatingThing key={thing.name} thing={thing} />
          ))}
        </group>
      </group>
    </Suspense>
  );
};
