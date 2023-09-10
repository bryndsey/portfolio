import { config, useSpringValue } from "@react-spring/web";
import { Billboard, Float, Html, Text } from "@react-three/drei";
import { RootState, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Group, MathUtils, Vector3 } from "three";
import { useHtmlPortal } from "../hooks/useHtmlPortal";
import { useSpringScaleVisibility } from "../hooks/useSpringScaleVisibility";
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
      0.4,
    ],
  },
  {
    name: "Music",
    positionFn: (state) => [
      state.viewport.width * -0.25,
      state.viewport.height * 0.2,
      -0.1,
    ],
  },
  {
    name: "Games",
    positionFn: (state) => [
      state.viewport.width * 0.3,
      state.viewport.height * -0.175,
      -0.1,
    ],
  },
  {
    name: "3D models",
    positionFn: (state) => [0, state.viewport.height * -0.25, 0.1],
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

const groupWorldPosition = new Vector3();

const floatingTextVisibilityThreshold = 0.3;

const FloatingThing = (props: { thing: ThingIMake }) => {
  const { thing } = props;

  // const htmlPortal = useHtmlPortal();
  const htmlPortal = useThree((state) => state.gl.domElement.parentElement!);

  const groupRef = useRef<Group>(null!);
  const htmlRef = useRef<HTMLDivElement>(null);

  const { springValue, setVisibility } = useSpringScaleVisibility();

  useFrame((state) => {
    const position = thing.positionFn(state);

    const floatOffset = [
      // Offset by amount of a different component for more apparent randomness
      0.1 *
        Math.sin(
          (state.clock.elapsedTime + (position[1] + position[2]) * 80) * 0.3
        ),
      0.066 *
        Math.sin(
          (state.clock.elapsedTime + (position[2] + position[0]) * 60) * 0.2
        ),
      0.025 *
        Math.sin(
          (state.clock.elapsedTime + (position[0] + position[1]) * 70) * 0.4
        ),
    ];

    groupRef.current.position.set(
      position[0] + floatOffset[0],
      position[1] + floatOffset[1],
      position[2] + floatOffset[2]
    );

    if (htmlRef.current === null) return;
    const zPositionOpacity = MathUtils.mapLinear(
      position[2],
      -0.5,
      0.5,
      0.3,
      0.8
    );

    groupWorldPosition.set(0, 0, 0);
    const worldPosition = groupRef.current.localToWorld(groupWorldPosition);

    const shouldBeVisible =
      worldPosition.y >
      -state.viewport.height * floatingTextVisibilityThreshold;

    setVisibility(shouldBeVisible);

    groupRef.current.scale.setScalar(springValue.get());

    htmlRef.current.style.opacity = `${zPositionOpacity}`;

    htmlRef.current.hidden = !groupRef.current.visible;
  });

  return (
    <group ref={groupRef}>
      <Html
        ref={htmlRef}
        transform
        portal={{ current: htmlPortal }}
        distanceFactor={1}
        pointerEvents={"none"}
      >
        <p className="text-2xl 2xs:text-4xl xs:text-5xl md:text-6xl font-extrabold whitespace-nowrap">
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

      if (wordCloudGroupRef.current.visible != isPageVisible) {
        wordCloudGroupRef.current.children.forEach(
          (child) => (child.visible = isPageVisible)
        );
        wordCloudGroupRef.current.visible = isPageVisible;
      }

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
            <p className="font-semibold text-5xl sm:text-6xl md:text-7xl font-handwritten text-center">
              I like to make things.
            </p>
            <p className="text-xl xs:text-2xl sm:text-3xl md:text-4xl text-center font-handwritten">
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
