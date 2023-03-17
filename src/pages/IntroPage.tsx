import { useSpringValue, easings, config } from "@react-spring/web";
import { Center, Circle, Html, MeshDistortMaterial } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { Group, MathUtils, Mesh } from "three";
import { useHtmlPortal } from "../useHtmlPortal";
import { AvatarModel } from "./AvatarModel";
import { PageComponentProps } from "./Pages";
import { useScrollPages } from "./useScrollPages";

export const IntroPageContent = () => {
  return (
    <div className="max-w-xl m-auto p-8 flex">
      <div className="flex flex-col justify-center font-bold leading-none text-4xl sm:text-5xl text-center font-handwritten">
        <p>Hi. My name is</p>
        <p
          className="leading-none"
          style={{
            fontSize: "3em",
          }}
        >
          Bryan Lindsey.
        </p>
      </div>
    </div>
  );
};

const fullPortraitAspect = 0.75;
const fullLandscapeAspect = 1.5;

export const IntroPage = (props: PageComponentProps) => {
  const htmlPortal = useThree((state) => state.gl.domElement.parentElement!);

  const groupRef = useRef<Group>(null!);
  const contentRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<Mesh>(null!);
  const avatarRef = useRef<Group>(null);

  const avatarTransitionAnimationValue = useSpringValue(0, {
    config: config.gentle,
  });

  const bubbleTransitionAnimationValue = useSpringValue(0, {
    config: { ...config.stiff, precision: 0.0001, round: 0.005 },
  });

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    ({ enterAmount, exitAmount, isPageVisible, state }) => {
      groupRef.current.visible = isPageVisible;

      if (contentRef.current !== null) {
        contentRef.current.hidden = !isPageVisible;
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
        x: state.viewport.width * 0.2,
        y: 0,
      };
      const bubbleFullPortraitPosition = {
        x: 0.1,
        y: state.viewport.height * 0.25,
      };

      const bubblePosition = {
        x: MathUtils.lerp(
          bubbleFullPortraitPosition.x,
          bubbleFullLandscapePosition.x,
          // Scale this exponentially to get the curve I want
          Math.pow(currentAspectLerpVal, 0.3)
        ),
        y: MathUtils.lerp(
          bubbleFullPortraitPosition.y,
          bubbleFullLandscapePosition.y,
          currentAspectLerpVal
        ),
      };
      bubbleRef.current.position.set(bubblePosition.x, bubblePosition.y, 0);

      if (
        bubbleTransitionAnimationValue.goal === 0 &&
        state.clock.elapsedTime > 0.66
      ) {
        bubbleTransitionAnimationValue.start(1);
      }

      const bubbleScale =
        state.viewport.aspect > 1
          ? Math.min(state.viewport.width * 0.45, viewportHeight * 0.66)
          : Math.max(state.viewport.width * 0.45, 0.7);
      bubbleRef.current.scale.setScalar(
        bubbleScale * bubbleTransitionAnimationValue.get()
      );

      if (avatarRef.current === null) return;

      const avatarTransitionTarget = Math.abs(yPercent) < 0.01 ? 1 : 0;
      if (avatarTransitionAnimationValue.goal !== avatarTransitionTarget) {
        avatarTransitionAnimationValue.start(avatarTransitionTarget);
      }

      const avatarOffscreenY = -viewportHeight;

      const avatarFullLandscapePosition = {
        x: -state.viewport.width * 0.25,
        y: -state.viewport.height * 0.05,
      };
      const avatarFullPortraitPosition = {
        x: -0.1,
        y: -state.viewport.height * 0.25,
      };

      const avatarOnscreenPosition = {
        x: MathUtils.lerp(
          avatarFullPortraitPosition.x,
          avatarFullLandscapePosition.x,
          // Scale this exponentially to get the curve I want
          Math.pow(currentAspectLerpVal, 0.3)
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

      avatarRef.current.position.set(
        avatarOnscreenPosition.x,
        avatarActualY,
        0.2
      );

      let avatarVelocityScale = 1;
      if (Math.abs(avatarTransitionAnimationValue.velocity) > 0.0001) {
        avatarVelocityScale = 1 - avatarTransitionAnimationValue.velocity * 40;
      }

      const avatarMaxScale = viewportHeight;
      const avatarMinScale = 1.2;
      const avatarBaseScale = MathUtils.lerp(
        avatarMinScale,
        avatarMaxScale,
        currentAspectLerpVal
      );
      avatarRef.current.scale.set(
        avatarBaseScale / Math.pow(avatarVelocityScale, 0.5),
        avatarBaseScale * avatarVelocityScale,
        avatarBaseScale / Math.pow(avatarVelocityScale, 0.5)
      );

      avatarRef.current.lookAt(
        state.camera.position.x,
        avatarRef.current.position.y,
        state.camera.position.z
      );

      avatarRef.current.visible = isPageVisible;
    }
  );

  return (
    <>
      <group ref={groupRef}>
        <Circle args={[0.75, 64]} ref={bubbleRef}>
          {/* <meshBasicMaterial color="white" /> */}
          <MeshDistortMaterial
            color={"white"}
            distort={0.25}
            factor={2}
            speed={1}
          />
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
        </Circle>
        {/* <Text
        font={BryanSans}
        color="black"
        fontSize={0.2}
        overflowWrap={"normal"}
        maxWidth={viewport.width / 2}
      >
        Hi, my name is Bryan Lindsey
      </Text> */}
      </group>
      <Suspense fallback={null}>
        <Center ref={avatarRef}>
          <AvatarModel />
        </Center>
        {/* <Svg src={Avatar} scale={0.0005} position={[0.1, 0.1, 1]} /> */}
        {/* <Sphere args={[0.25]} position={[-1, 0, 0.5]}></Sphere> */}
      </Suspense>
    </>
  );
};
