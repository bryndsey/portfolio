import { CtaFooter } from "@/components/CtaFooter";
import { Page } from "@/components/Page";
import { useLoadingState } from "@/hooks/useLoadingState";
import { useSpringScaleVisibility } from "@/hooks/useSpringScaleVisibility";
import { animated } from "@react-spring/web";
import { useEffect } from "react";
import { Parallax } from "../../components/Parallax";
import { BryanHead } from "./BryanHead";
import { Platypus } from "./Platypus";

const evolutionSteps = [
  `I had never done any programming until college, where I originally went as a Math major. After stumbling into a few encounters with code though, I fell in love and graduated in 2012 with a degree in Computer Science, starting my first dev gig shortly after.`,
  `After a few years working in random tech stacks (X++, anyone?), I took some advice from a co-worker and taught myself Android development. In 2015 landed a job doing mobile development, which was also my initial experience in consulting.`,
  `Exposure to books like "Clean Code" and "Refactoring" evolved my technical skills to "Senior Developer" status. And with each client I worked with, my consulting skills continued to grow.`,
  `A chance encounter led me to learning React, Typescript, and other web tech in my free time starting in 2019, and I later made the switch to full-time web developer.`,
  `I continue to inherit new skills and tools, some of which you can see on display on this website as well as in my projects (and some of which I can't share... NDAs, sorry 😔).`,
];

export function AboutPage() {
  return <Page htmlChildren={<AboutPageContent />}></Page>;
}

function AboutPageContent() {
  const { loadingState } = useLoadingState();
  const { springValue, setVisibility } = useSpringScaleVisibility();
  useEffect(() => {
    setVisibility(loadingState === "loaded");
  }, [loadingState, setVisibility]);

  return (
    <div
      id="App"
      className="font-sans overflow-y-auto overflow-x-clip text-[calc(1.5vh+1.5vw)] leading-tight text-pretty"
    >
      <animated.header
        className="flex flex-row items-center"
        style={{ scale: springValue }}
      >
        <h1 className="font-bold text-[calc(1vh+7vw)] leading-none p-8">
          About Bryan
        </h1>
        {/* <div className="ml-auto mr-[2vw] mt-[2vh] scale-150 text-center rounded-full bg-white backdrop-blur w-[calc(6vw+6vh)] aspect-square flex flex-col justify-center items-center">
          <p className="text-[calc(0.75vh+0.75vw)] p-2">{`(Hey, that's me!)`}</p>
        </div> */}
      </animated.header>
      <main className="p-8 mt-4">
        <animated.div
          style={{ scale: springValue }}
          className="w-full flex flex-col md:flex-row landscape:flex-row rounded-2xl bg-white overflow-clip"
        >
          <div className="min-h-16 flex-1 aspect-square bg-green-600">
            <Parallax speed={1} className="w-full h-full">
              <BryanHead className="w-full h-full scale-125 md:scale-150" />
            </Parallax>
          </div>
          <div className="flex-1 md:max-w-[50%] landscape:max-w-[50%] flex flex-col justify-center gap-4 p-6 sm:p-8">
            <h2 className="text-4xl font-bold">TL;DR:</h2>
            <p>
              {`I'm a software engineer`}
              <span className="text-stone-500">*</span> focused on front-end web
              development.
            </p>
            <span className="text-[0.5em] text-stone-500">
              *(Or developer. Or programmer. Whatever you want to call it)
            </span>
            <p>
              {`I've picked up a`}{" "}
              <span className="line-through text-stone-500">particular</span>{" "}
              wide set of skills, both technical and non-technical, and a knack
              for adapting to changing technologies and contexts over my 11+
              year career.
            </p>
            <p className="text-[0.66em] text-stone-500">
              Also, my favorite animal is the platypus.
            </p>
          </div>
        </animated.div>

        <div className="relative h-[80dvh]">
          <Parallax speed={4} className="absolute w-full z-50">
            <animated.h2
              style={{ scaleY: springValue }}
              className="text-[calc(3vh+3vw)] min-h-[100dvh] leading-none font-bold bg-yellow-300 -mx-8 px-8 flex flex-col justify-evenly z-50"
            >
              <Parallax speed={-4}>{`The Long Version:`}</Parallax>
            </animated.h2>
          </Parallax>
        </div>
        <animated.div
          style={{ scale: springValue }}
          className="fw-full flex flex-col md:flex-row landscape:flex-row gap-6 rounded-2xl bg-white overflow-clip"
        >
          <div className="md:max-w-[50%] landscape:max-w-[50%] p-6 sm:p-8 flex flex-col justify-center gap-4">
            <p className="text-[1.5em]">
              The platypus is an evoutionary marvel.
            </p>
            <p className="text-stone-500 text-[0.75em]">
              {`It's a mammal, but it lays eggs. It's got a bill and webbed feet
                like a duck, but has fur. It's got a tail like a beaver and
                venom like a reptile.`}
            </p>
          </div>
          <div className="bg-green-600 min-h-16 flex-1 aspect-square grid place-items-center">
            <Parallax speed={1} className="w-full h-full">
              <Platypus className="w-full scale-125 md:scale-150 aspect-square" />
            </Parallax>
          </div>
        </animated.div>
        <Parallax speed={2}>
          <animated.div
            style={{ scale: springValue }}
            className="p-[2.5em] text-center text-[1.5em]"
          >
            {`It's a unique creature that has adapted in a way that makes it
                versatile and fascinating.`}
          </animated.div>
        </Parallax>
        <animated.section
          style={{ scale: springValue }}
          className="w-full overflow-x-visible mt-[25dvh]"
        >
          <Parallax speed={2} className="">
            <h3 className="text-end font-bold text-[2em]">My Evolution</h3>
          </Parallax>
          {/* <Parallax speed={0.1}> */}
          <div className="flex flex-row overflow-x-auto gap-[3em] p-8 -mx-8 bg-gradient-radial from-green-500 to-green-600 -translate-y-6">
            {evolutionSteps.map((step) => (
              <div
                key={step}
                className="rounded-2xl p-[1.5em] bg-white/90 backdrop-blur w-[40ch] max-w-[75%] flex-shrink-0"
              >
                {step}
              </div>
            ))}
          </div>
          {/* </Parallax> */}
        </animated.section>
        <animated.section style={{ scale: springValue }} className="mt-[33dvh]">
          <Parallax
            speed={-0.75}
            className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] rounded-2xl bg-white overflow-clip mx-4 text-[0.9em]"
          >
            <ul className="list-inside list-decimal space-y-[0.75em] text-[0.75em] p-6 sm:p-8 bg-gradient-radial from-green-500 to-green-600">
              <h4 className="text-[1.5em]">Platypus:</h4>
              <li>A great swimmer; also walks on land</li>
              <li>
                Can see, smell, and hear; also senses electric fields to find
                food
              </li>
              <li>
                {`Freakin' adorable; could also straight up kill you with its
                  murder-spur if it needed to`}
              </li>
            </ul>
            <p className="p-6 sm:p-8 text-[1.5em] font-bold self-center">
              The platypus has many adaptations that give it a broad set of
              capabilities.
            </p>
          </Parallax>
          <Parallax
            speed={1.5}
            className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] mt-24 rounded-2xl bg-white overflow-clip"
          >
            <p className="p-6 sm:p-8 text-[1.5em] font-bold self-center">
              So too have I adapted and broadened my own capabilities.
            </p>
            <ul className="list-inside list-decimal space-y-[0.75em] text-[0.75em] p-6 sm:p-8 bg-gradient-radial from-green-500 to-green-600">
              <h4 className="text-[1.5em]">Bryan:</h4>
              <li>
                Front-end web developer; can also learn new tools and tech
                stacks
              </li>
              <li>
                {`Experienced in technical architecture; also a product-focused
                  consultant with "squishy" people skills`}
              </li>
              <li>Problem-solver; also enjoys creative projects</li>
            </ul>
          </Parallax>
        </animated.section>
        <animated.section
          style={{ scale: springValue }}
          className="gap-6 mt-[25dvh] min-h-[150dvh] flex flex-col justify-between leading-tight text-[calc(1.5vh+1.5vw)]"
        >
          <p>
            {`Am I forcing a metaphor because the platypus is my favorite animal?`}
          </p>
          <Parallax speed={2}>
            <p className="font-bold text-[1.25em]">Perhaps.</p>
          </Parallax>
          <Parallax speed={-1} className="text-end max-w-[40ch] self-end">
            <p>
              But I genuinely find the platypus an intriguing and often
              underappreciated creature because of its unique evolutionary
              features;
            </p>
          </Parallax>
          <Parallax speed={1}>
            <p className="text-[1.33em] max-w-[40ch]">
              I like to think my own diverse background and adaptability make me
              a similarly interesting and well-rounded (if maybe a little
              unusual) <span className="line-through opacity-50">creature</span>{" "}
              developer and consultant.
            </p>
          </Parallax>
        </animated.section>
      </main>

      <Parallax speed={3}>
        <CtaFooter />
      </Parallax>
    </div>
  );
}
