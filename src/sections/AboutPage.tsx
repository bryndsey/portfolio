import { useHtmlPortal } from "@hooks/useHtmlPortal";
import { useSpringScaleVisibility } from "@hooks/useSpringScaleVisibility";
import { Html } from "@react-three/drei";
import { RootState, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Group, MathUtils, Vector3 } from "three";
import { PageComponentProps } from "./Pages";
import { useScrollPages } from "./useScrollPages";

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
          className="p-4 sm:p-8 overflow-clip"
        >
          <section className="h-full w-full flex flex-col flex-wrap justify-around gap-4 p-8 sm:p-12 bg-white bg-opacity-80 backdrop-blur rounded-3xl text-xl sm:text-2xl overflow-x-auto text-pretty">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-handwritten">
                {"I like making things."}
              </h2>
              <p className="mt-8 text-stone-500">{"For example, I once..."}</p>
              <ul className="text-lg sm:text-xl md:text-2xl indent-2">
                <li>{"...animated a dancing banana"}</li>
                <li>
                  {
                    '...scanned my own head with LiDAR so I could 3D print a tiny "me"'
                  }
                </li>
                <li>{"...spent 3 hours folding an origami moose"}</li>
                <li>
                  {
                    "...made a VR version of that castle defense Flash game (you know the one...)"
                  }
                </li>
              </ul>
            </div>
            <div>
              <p className="mt-8">But mainly</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-handwritten">
                {"I'm a front-end software engineer"}
              </h2>
              <p className="text-stone-500 text-xs">
                {
                  "(Or software developer. Or programmer. Whatever you wanna call it.)"
                }
              </p>
              <p className="mt-4">
                {
                  'As with my hobbies though, when it comes to my work, I consider myself a "jack of all trades" - a technologist, if you will. I\'m often learning about and experimenting with all kinds of tools and tech.'
                }
              </p>
            </div>
            <div className="mt-8">
              That being said, my typical tech stack includes:
              <ul className="indent-4 text-lg sm:text-xl md:text-2xl">
                <li>React</li>
                <li>Typescript</li>
                <li>TailwindCSS</li>
                <li>Three.js + react-three-fiber</li>
                <li>Astro</li>
              </ul>
            </div>
          </section>
        </Html>
      </group>
    </Suspense>
  );
};
