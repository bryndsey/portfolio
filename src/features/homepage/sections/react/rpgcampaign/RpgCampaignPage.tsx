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
import { useEffect, useRef, useState } from "react";
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

  const [physicsPaused, setPhysicsPaused] = useState(true);

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
      if (physicsPaused === isPageVisible) {
        setPhysicsPaused(!isPageVisible);
      }

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
  const d20RigidBodyRef2 = useRef<RapierRigidBody>(null!);

  function rollDice() {
    [d20RigidBodyRef, d20RigidBodyRef2].forEach((rb) =>
      rb.current.applyImpulse(
        {
          x: (Math.random() - 0.5) * 2,
          y: 0.25,
          z: (Math.random() - 0.5) * 2,
        },
        true
      )
    );
  }

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

      <group ref={d20GroupRef} scale={3} position={[-0.5, 0, 0.5]}>
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

        <Physics paused={physicsPaused}>
          <group onClick={rollDice}>
            <RigidBody
              position={[0, 0.5, 0]}
              colliders="hull"
              gravityScale={3}
              restitution={0.5}
              ref={d20RigidBodyRef}
            >
              <D20Model />
            </RigidBody>
          </group>

          <group onClick={rollDice}>
            <RigidBody
              position={[0, 0.75, 0]}
              colliders="hull"
              gravityScale={3}
              restitution={0.5}
              ref={d20RigidBodyRef2}
            >
              <D20Model />
            </RigidBody>
          </group>

          <RigidBody type="fixed" position={[0, -0.15, 0]}>
            <CuboidCollider args={[100, 0.05, 100]}>
              <Plane
                args={[1, 1]}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.05, 0]}
                // material={}
              ></Plane>
            </CuboidCollider>

            <CuboidCollider
              args={[100, 0.05, 100]}
              position={[0, 0, -0.25]}
              rotation={[Math.PI / 2.25, 0, 0]}
            >
              {/* <Plane args={[1, 1]} rotation={[-Math.PI / 2, 0, 0]}></Plane> */}
            </CuboidCollider>

            <CuboidCollider
              args={[100, 0.05, 100]}
              position={[0, 0, 0.25]}
              rotation={[-Math.PI / 2.25, 0, 0]}
            >
              {/* <Plane args={[1, 1]} rotation={[-Math.PI / 2, 0, 0]}></Plane> */}
            </CuboidCollider>

            <CuboidCollider
              args={[100, 0.05, 100]}
              position={[0.25, 0, 0]}
              rotation={[Math.PI / 2, 0, Math.PI / 2]}
            >
              {/* <Plane args={[1, 1]} rotation={[-Math.PI / 2, 0, 0]}></Plane> */}
            </CuboidCollider>

            <CuboidCollider
              args={[100, 0.05, 100]}
              position={[-0.25, 0, 0]}
              rotation={[Math.PI / 2, 0, -Math.PI / 2]}
            >
              {/* <Plane args={[1, 1]} rotation={[-Math.PI / 2, 0, 0]}></Plane> */}
            </CuboidCollider>
          </RigidBody>
        </Physics>
      </group>
    </group>
  );
};
