import { useHtmlPortal } from "@hooks/useHtmlPortal";
import { useSpringScaleVisibility } from "@hooks/useSpringScaleVisibility";
import { Html } from "@react-three/drei";
import { RootState, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Group, MathUtils, Vector3 } from "three";
import { PageComponentProps } from "./Pages";
import { useScrollPages } from "./useScrollPages";

import {
  AstroTag,
  ReactTag,
  Tag,
  TailwindTag,
  ThreeJsTag,
  TypescriptTag,
} from "./components/ProjectDescription";

interface FloatingTextData {
  name: string;
  positionFn: (state: RootState) => number[];
}

const floatingTextList: FloatingTextData[] = [
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

const FloatingText = (props: { textData: FloatingTextData }) => {
  const { textData } = props;

  const htmlPortal = useHtmlPortal();

  const groupRef = useRef<Group>(null!);
  const htmlRef = useRef<HTMLDivElement>(null);

  const { springValue, setVisibility } = useSpringScaleVisibility();

  useFrame((state) => {
    const position = textData.positionFn(state);

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
          {textData.name}
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
        <group ref={wordCloudGroupRef}>
          {/* {floatingTextList.map((thing) => (
            <FloatingText key={thing.name} textData={thing} />
          ))} */}
        </group>
        <Html
          ref={contentRef}
          fullscreen
          portal={{ current: htmlPortal }}
          zIndexRange={[0, 0]}
          className="p-4 sm:p-8 overflow-clip grid items-center"
        >
          <AboutMe />
        </Html>
      </group>
    </Suspense>
  );
};

function AboutMe() {
  return (
    <section className="min-h-[75%] w-full flex flex-col flex-wrap gap-2 portrait:gap-4 sm:gap-4 p-4 sm:p-6 md:p-8 bg-white bg-opacity-80 backdrop-blur rounded-3xl text-lg sm:text-xl md:text-2xl overflow-x-auto text-pretty">
      <h2 className="text-3xl sm:text-4xl md:text-6xl portrait:text-6xl font-handwritten squiggly">
        {"I like to make things"}
      </h2>
      <div className="flex flex-col flex-grow landscape:flex-row landscape:items-end justify-between gap-x-[5%] gap-y-8">
        <div className="flex flex-col gap-6 max-w-[38ch]">
          <p>Web apps. 3D models. Games. Music. Bad jokes.</p>
          <p>
            {
              "I especially like to make things that bring together creativity and problem-solving."
            }
          </p>
        </div>
        <div className="min-w-[33%]">
          <h3 className="font-bold">Frequent tech stack:</h3>
          <ul className="text-lg sm:text-xl md:text-2xl">
            <li>
              <TechStackItem tag={ReactTag} />
            </li>
            <li>
              <TechStackItem tag={TypescriptTag} />
            </li>
            <li>
              <TechStackItem tag={TailwindTag} />
            </li>
            <li>
              <TechStackItem tag={AstroTag} />
            </li>
            <li>
              <TechStackItem tag={ThreeJsTag} />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function TechStackItem({ tag }: { tag: Tag }) {
  return (
    <div className="flex gap-2 items-center">
      <tag.icon className="w-4 h-4 sm:w-6 sm:h-6" color={tag.color} />
      {tag.name}
    </div>
  );
}

