import { config, useSpringValue } from "@react-spring/web";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Group, MathUtils } from "three";
import { Blob } from "@/blobs/Blob";
import { useLoadingState } from "@hooks/useLoadingState";
import { PageComponentProps } from "@/homepage/sections/Pages";
import { useScrollPages } from "@/homepage/sections/useScrollPages";
import { AvatarModel } from "./AvatarModel";

export const IntroPageContent = () => {
  return (
    <div className="max-w-xl m-auto p-8 flex">
      <div className="flex flex-col justify-center leading-none text-3xl sm:text-4xl text-center">
        <p className="text-stone-600">Hi. My name is</p>
        <p
          className="leading-none font-handwritten tracking-wide squiggly"
          style={{
            fontSize: "3em",
          }}
        >
          Bryan Lindsey.
        </p>
        <p className="mt-4">{"I'm a front-end developer."}</p>
        {/* <p className="text-stone-500 hidden sm:block text-xs sm:text-sm">
          {"(Or software engineer. Or programmer. Whatever you wanna call it.)"}
        </p> */}
        <p className="text-stone-400 mt-4" style={{ fontSize: "0.5em" }}>
          (Scroll for more)
        </p>
      </div>
    </div>
  );
};

const fullPortraitAspect = 0.75;
const fullLandscapeAspect = 1.75;

export const IntroPage = (props: PageComponentProps) => {
  const htmlPortal = useThree((state) => state.gl.domElement.parentElement!);

  const groupRef = useRef<Group>(null!);
  const contentRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<Group>(null!);
  const avatarRef = useRef<Group>(null);

  const avatarTransitionAnimationValue = useSpringValue(0, {
    config: config.gentle,
  });

  const bubbleTransitionAnimationValue = useSpringValue(0, {
    config: { ...config.stiff, precision: 0.0001, round: 0.005 },
  });

  const { loadingTransistionValue } = useLoadingState();

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    ({ enterAmount, exitAmount, isPageVisible, state }) => {
      const hasLoaded = loadingTransistionValue.get() === 1;
      const showContents = isPageVisible && hasLoaded;

      groupRef.current.visible = showContents;

      if (contentRef.current !== null) {
        contentRef.current.hidden = !showContents;
      }

      if (avatarRef.current !== null) {
        avatarRef.current.visible = showContents;
      }

      const yPercent = enterAmount + exitAmount;

      const viewportHeight = state.viewport.height;
      groupRef.current.position.setY(yPercent * viewportHeight);

      const currentAspect = state.viewport.aspect;

      const currentAspectLerpVal = MathUtils.smootherstep(
        currentAspect,
        fullPortraitAspect,
        fullLandscapeAspect
      );

      const bubbleFullLandscapePosition = {
        x: state.viewport.width * 0.175,
        y: 0,
      };
      const bubbleFullPortraitPosition = {
        x: 0,
        y: state.viewport.height * 0.25,
      };

      const bubblePosition = {
        x: MathUtils.lerp(
          bubbleFullPortraitPosition.x,
          bubbleFullLandscapePosition.x,
          // Scale this exponentially to get the curve I want
          Math.pow(currentAspectLerpVal, 0.175)
        ),
        y: MathUtils.lerp(
          bubbleFullPortraitPosition.y,
          bubbleFullLandscapePosition.y,
          currentAspectLerpVal
        ),
      };
      bubbleRef.current.position.set(bubblePosition.x, bubblePosition.y, 0);

      const bubbleScale =
        state.viewport.aspect > 1
          ? Math.min(state.viewport.width * 0.45, viewportHeight * 0.66)
          : Math.max(state.viewport.width * 0.45, 0.7);
      bubbleRef.current.scale.setScalar(
        bubbleScale * bubbleTransitionAnimationValue.get()
      );

      const avatarOffscreenY = -viewportHeight * 1.5;

      const avatarFullLandscapePosition = {
        x: -state.viewport.width * 0.275,
        y: -state.viewport.height * 0.4,
      };
      const avatarFullPortraitPosition = {
        x: -0.1,
        y: -state.viewport.height * 0.4,
      };

      const avatarOnscreenPosition = {
        x: MathUtils.lerp(
          avatarFullPortraitPosition.x,
          avatarFullLandscapePosition.x,
          // Scale this exponentially to get the curve I want
          Math.pow(currentAspectLerpVal, 0.175)
        ),
        y: MathUtils.lerp(
          avatarFullPortraitPosition.y,
          avatarFullLandscapePosition.y,
          currentAspectLerpVal
        ),
      };

      const avatarActualY = MathUtils.lerp(
        avatarOffscreenY,
        avatarOnscreenPosition.y,
        avatarTransitionAnimationValue.get()
      );

      if (avatarRef.current === null) return;

      avatarRef.current.position.set(
        avatarOnscreenPosition.x,
        avatarActualY,
        0.2
      );

      let avatarVelocityScale = 1;
      if (Math.abs(avatarTransitionAnimationValue.velocity) > 0.0001) {
        avatarVelocityScale = 1 - avatarTransitionAnimationValue.velocity * 40;
      }

      const avatarIdleLoopInput = Math.sin(state.clock.elapsedTime * 2.5);
      const avatarIdleLoopScale = MathUtils.mapLinear(
        avatarIdleLoopInput,
        -1,
        1,
        0.99,
        1.01
      );

      const avatarMaxScale = viewportHeight;
      const avatarMinScale = 1.2;
      const avatarBaseScale = MathUtils.lerp(
        avatarMinScale,
        avatarMaxScale,
        currentAspectLerpVal
      );

      const avatarAlteredScale = avatarVelocityScale * avatarIdleLoopScale;

      avatarRef.current.scale.set(
        avatarBaseScale / Math.pow(avatarAlteredScale, 0.5),
        avatarBaseScale * avatarAlteredScale,
        avatarBaseScale / Math.pow(avatarAlteredScale, 0.5)
      );

      avatarRef.current.lookAt(
        state.camera.position.x,
        avatarRef.current.position.y,
        state.camera.position.z
      );

      if (!hasLoaded) return;

      if (
        bubbleTransitionAnimationValue.goal === 0 &&
        state.clock.elapsedTime > 0.66
      ) {
        bubbleTransitionAnimationValue.start(1);
      }

      const avatarTransitionTarget = Math.abs(yPercent) < 0.05 ? 1 : 0;
      if (avatarTransitionAnimationValue.goal !== avatarTransitionTarget) {
        avatarTransitionAnimationValue.start(avatarTransitionTarget);
      }
    }
  );

  return (
    <>
      <group ref={groupRef}>
        <group ref={bubbleRef}>
          <Blob size={1.85} color={"white"} speed={0.25} />

          <Html
            ref={contentRef}
            transform
            distanceFactor={1}
            pointerEvents={"none"}
            position-z={0.1}
            portal={{ current: htmlPortal }}
          >
            <IntroPageContent />
          </Html>
        </group>
      </group>
      <Suspense fallback={null}>
        {/* <Center ref={centeredAvatarRef}> */}
        <group ref={avatarRef}>
          <AvatarModel />
        </group>
        {/* </Center> */}
        {/* <Svg src={Avatar} scale={0.0005} position={[0.1, 0.1, 1]} /> */}
        {/* <Sphere args={[0.25]} position={[-1, 0, 0.5]}></Sphere> */}
      </Suspense>
    </>
  );
};
