import {
  ProjectDescription,
  ReactTag,
  TailwindTag,
  TypescriptTag,
} from "@/components/ProjectDescription";
import { PageComponentProps } from "@/features/homepage/sections/Pages";
import { useScrollPages } from "@/features/homepage/sections/useScrollPages";
import { useHtmlPortal } from "@hooks/useHtmlPortal";
import { useScreenState } from "@hooks/useScreenState";
import { useSpringScaleVisibility } from "@hooks/useSpringScaleVisibility";
import { Html, Plane, QuadraticBezierLine } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import { D20Model } from "./D20Model";
import {
  Physics,
  RigidBody,
  CuboidCollider,
  MeshCollider,
  RapierRigidBody,
} from "@react-three/rapier";

export const RpgCampaignPage = (props: PageComponentProps) => {
  const htmlPortal = useHtmlPortal();
  const pageGroupRef = useRef<Group>(null);
  const descriptionGroupRef = useRef<Group>(null!);
  const d20GroupRef = useRef<Group>(null!);

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

      const d20ScrollAmount = enterAmount + exitAmount;

      const viewportHeight = state.viewport.height;
      d20GroupRef.current.position.setY(d20ScrollAmount * viewportHeight);
    }
  );

  const d20RigidBodyRef = useRef<RapierRigidBody>(null!);

  return (
    <group ref={pageGroupRef}>
      <group ref={descriptionGroupRef}>
        <Html
          ref={contentRef}
          portal={{ current: htmlPortal }}
          className="rounded-2xl p-6 sm:p-8 bg-white/90 backdrop-blur transition-opacity duration-300"
          distanceFactor={descriptionScaleFactor}
        >
          <ProjectDescription
            projectName="RPG Campaign Generator"
            descriptionText="AI-powered RPG campaigns at the push of a button"
            tags={[ReactTag, TypescriptTag, TailwindTag]}
            url="https://tictactoeplus.bryanlindsey.dev/"
          />
        </Html>
      </group>
      <group ref={d20GroupRef}>
        {/* <QuadraticBezierLine
          start={[1, 1, -1]}
          end={[-0.25, 0, 0]}
          mid={[0.5, 1.25, -0.5]}
        />
        <QuadraticBezierLine
          end={[-0.75, 0, 0.25]}
          start={[-0.25, 0, 0]}
          mid={[-0.5, 0.75, 0.125]}
        />
        <QuadraticBezierLine
          start={[-0.75, 0, 0.25]}
          end={[-0.25, 0, 0.75]}
          mid={[-0.5, 0.25, 0.5]}
        /> */}

        {/* <group scale={3} position={[1, 0, 0]}>
          <D20Model />
        </group> */}

        <Physics debug>
          <RigidBody
            position={[0, 0.5, 0]}
            colliders="hull"
            ref={d20RigidBodyRef}
          >
            <group
              onClick={() => {
                d20RigidBodyRef.current.applyImpulse(
                  { x: 0, y: 0, z: -0.01 },
                  true
                );
              }}
            >
              <D20Model />
            </group>
          </RigidBody>

          <RigidBody type="fixed" position={[0, -0.25, 0]}>
            {/* <MeshCollider type="hull">
              <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]}></Plane>
            </MeshCollider> */}
            <CuboidCollider args={[100, 0.05, 100]}>
              <Plane args={[1, 1]} rotation={[-Math.PI / 2, 0, 0]}></Plane>
            </CuboidCollider>
            <CuboidCollider
              args={[100, 0.05, 100]}
              position={[0, 0, -0.5]}
              rotation={[Math.PI / 2.75, 0, 0]}
            >
              <Plane args={[1, 1]} rotation={[-Math.PI / 2, 0, 0]}></Plane>
            </CuboidCollider>

            <CuboidCollider
              args={[100, 0.05, 100]}
              position={[0.1, 0, 0.5]}
              rotation={[-Math.PI / 2.5, 0.75, 1]}
            >
              <Plane args={[1, 1]} rotation={[-Math.PI / 2, 0, 0]}></Plane>
            </CuboidCollider>

            <CuboidCollider
              args={[100, 0.05, 100]}
              position={[-0.1, 0, 0.5]}
              rotation={[-Math.PI / 2.5, -0.75, -1]}
            >
              <Plane args={[1, 1]} rotation={[-Math.PI / 2, 0, 0]}></Plane>
            </CuboidCollider>
          </RigidBody>
        </Physics>
      </group>
    </group>
  );
};
