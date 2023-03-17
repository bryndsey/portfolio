import { Center, Circle, Html, MeshDistortMaterial } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group, MathUtils, Mesh } from "three";
import { useHtmlPortal } from "../useHtmlPortal";
import { useScreenState } from "../useScreenState";
import { AvatarModel } from "./AvatarModel";
import { PageComponentProps } from "./Pages";
import { useScrollPages } from "./useScrollPages";

export const IntroPageContent = () => {
  return (
    <div className="max-w-lg m-auto p-8 flex">
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
  const htmlPortal = useHtmlPortal();

  const groupRef = useRef<Group>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<Mesh>(null!);
  const avatarRef = useRef<Group>(null!);

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    ({ enterAmount, exitAmount, isPageVisible, state }) => {
      if (groupRef.current === null) return;

      groupRef.current.visible = isPageVisible;
      avatarRef.current.visible = isPageVisible;

      if (contentRef.current === null) return;
      contentRef.current.hidden = !isPageVisible;

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
          Math.pow(currentAspectLerpVal, 0.5)
        ),
        y: MathUtils.lerp(
          bubbleFullPortraitPosition.y,
          bubbleFullLandscapePosition.y,
          currentAspectLerpVal
        ),
      };
      bubbleRef.current.position.set(bubblePosition.x, bubblePosition.y, 0);

      const bubbleScale = Math.max(state.viewport.width * 0.4, 0.75);
      bubbleRef.current.scale.setScalar(bubbleScale);

      const avatarFullLandscapePosition = {
        x: -state.viewport.width * 0.25,
        y: -state.viewport.height * 0.1,
      };
      const avatarFullPortraitPosition = {
        x: -0.1,
        y: -state.viewport.height * 0.25,
      };

      const avatarPosition = {
        x: MathUtils.lerp(
          avatarFullPortraitPosition.x,
          avatarFullLandscapePosition.x,
          Math.pow(currentAspectLerpVal, 0.5)
        ),
        y: MathUtils.lerp(
          avatarFullPortraitPosition.y,
          avatarFullLandscapePosition.y,
          currentAspectLerpVal
        ),
      };
      avatarRef.current.position.set(avatarPosition.x, avatarPosition.y, 0.2);

      const avatarMaxScale = 1.5;
      const avatarMinScale = 1.2;
      avatarRef.current.scale.setScalar(
        MathUtils.lerp(avatarMinScale, avatarMaxScale, currentAspectLerpVal)
      );

      // avatarRef.current.position.set(
      //   -state.viewport.width * 0.25,
      //   -state.viewport.height * 0.1,
      //   0.2
      // );
      avatarRef.current.lookAt(
        state.camera.position.x,
        avatarRef.current.position.y + groupRef.current.position.y,
        state.camera.position.z
      );
    }
  );

  return (
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
      <Center ref={avatarRef}>
        <AvatarModel />
      </Center>
      {/* <Svg src={Avatar} scale={0.0005} position={[0.1, 0.1, 1]} /> */}
      {/* <Sphere args={[0.25]} position={[-1, 0, 0.5]}></Sphere> */}
    </group>
  );
};
