import { useHtmlPortal } from "@hooks/useHtmlPortal";
import { Html } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { Group } from "three";
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

export const AboutPage = (props: PageComponentProps) => {
  const htmlPortal = useHtmlPortal();
  const groupRef = useRef<Group>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current !== null) {
      contentRef.current.hidden = true;
    }
  }, []);

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    ({ enterAmount, exitAmount, isPageVisible, state }) => {
      if (contentRef.current !== null) {
        contentRef.current.hidden = !isPageVisible;
      }

      if (groupRef.current === null) return;

      groupRef.current.visible = isPageVisible;

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
          className="p-4 sm:p-8 overflow-clip grid items-center"
        >
          <AboutMe />
        </Html>
      </group>
    </Suspense>
  );
};

const techStackTags: Tag[] = [
  ReactTag,
  TypescriptTag,
  TailwindTag,
  ThreeJsTag,
  AstroTag,
];

function AboutMe() {
  return (
    <section className="min-h-[66%] w-full text-[calc(1.5vw+1.5vh)] flex flex-col flex-wrap gap-[1.5em] p-[2.5em] bg-white rounded-3xl overflow-x-auto text-pretty">
      <h2 className="font-handwritten squiggly leading-none text-[calc(4vw+4vh)]">
        {"I like to make things"}
      </h2>
      <div className="flex flex-col flex-grow landscape:flex-row justify-between gap-x-[5%] gap-y-8">
        <div className="flex flex-col gap-[1.5em] max-w-[38ch]">
          <p>Web apps. 3D models. Games. Music. Bad jokes.</p>
          <div>
            <p>
              {
                "I especially like to make things that bring together creativity and problem-solving."
              }
            </p>
            <p className="text-[1.25em]">🎨 + 🧩 = 🫶</p>
          </div>
        </div>
        <div className="min-w-[12em]">
          <h3 className="font-bold">Frequent Tech Stack:</h3>
          <ul>
            {techStackTags.map((tag) => (
              <TechStackItem key={tag.name} tag={tag} />
            ))}
          </ul>
        </div>
      </div>
      {import.meta.env.DEV && (
        <a
          href="/about"
          className="w-fit text-green-600 hover:scale-110 duration-200"
        >
          {"Learn more →"}
        </a>
      )}
    </section>
  );
}

function TechStackItem({ tag }: { tag: Tag }) {
  return (
    <div className="flex gap-[0.5em] items-center">
      <tag.icon className="size-[1em]" color={tag.color} />
      {tag.name}
    </div>
  );
}
