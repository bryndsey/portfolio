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
import { Html, Text } from "@react-three/drei";
import {
  CuboidCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useRef, useState } from "react";
import { Group, Material, Mesh } from "three";
import { D20Model } from "./D20Model";

export const RpgCampaignPage = (props: PageComponentProps) => {
  const htmlPortal = useHtmlPortal();
  const pageGroupRef = useRef<Group>(null);
  const descriptionGroupRef = useRef<Group>(null!);
  const d20GroupRef = useRef<Group>(null!);

  const tonePromptText = useRef<Mesh>(null!);
  const settingPromptText = useRef<Mesh>(null!);

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
          ? [
              -viewport.width * 0.4,
              -viewport.height * 0.33 + 0.66 / viewport.width,
            ]
          : [0, viewport.height * 0.33];

      const descriptionScrollAmount = enterAmount + exitAmount;

      descriptionGroupRef.current.position.setX(descriptionX);
      descriptionGroupRef.current.position.setY(descriptionY);

      const showDescription = descriptionScrollAmount === 0;
      setVisibility(showDescription);
      contentRef.current.style.scale = `${springValue.get()}`;
      contentRef.current.style.opacity = showDescription ? "1" : "0";

      const d20ScrollAmount = enterAmount + exitAmount;

      const [diceXOffset, diceYOffset, diceZOffset] =
        screenState.orientation === "portrait" &&
        screenState.deviceClass === "small"
          ? [0, viewport.height * 0.33, -1 / state.viewport.width]
          : [-0.166 * state.viewport.width, 0, 0];

      const viewportHeight = state.viewport.height;
      d20GroupRef.current.position.setY(
        d20ScrollAmount * viewportHeight + diceYOffset
      );
      d20GroupRef.current.position.setX(diceXOffset);
      d20GroupRef.current.position.setZ(diceZOffset);

      const promptScrollAmount =
        enterAmount + exitAmount + contentProgressAmount * 0.5;

      tonePromptText.current.position.setX(
        (promptScrollAmount * state.viewport.width) / 2 - 0.1
      );
      settingPromptText.current.position.setX(-promptScrollAmount - 0.3);

      [tonePromptText.current, settingPromptText.current].forEach((text) => {
        const material = text.material as Material;
        material.opacity =
          Math.max(
            1 - Math.pow(promptScrollAmount + text.position.y / 4, 2),
            0
          ) / 2;
      });
    }
  );

  const d20RigidBodyRef = useRef<RapierRigidBody>(null!);
  const d20RigidBodyRef2 = useRef<RapierRigidBody>(null!);

  function rollDice() {
    [d20RigidBodyRef, d20RigidBodyRef2].forEach((rb) =>
      rb.current.applyImpulse(
        {
          x: (Math.random() - 0.5) * 2,
          y: 0.33,
          z: (Math.random() - 0.5) * 2,
        },
        true
      )
    );
  }

  return (
    <group ref={pageGroupRef}>
      <Text
        position={[-0.1, 1, -1.5]}
        fontSize={0.2}
        fontWeight={800}
        color={"black"}
        ref={tonePromptText}
      >
        Tone: Adventurous
      </Text>
      <Text
        position={[0.1, 0.5, -3]}
        fontSize={0.25}
        fontWeight={800}
        color={"black"}
        ref={settingPromptText}
      >
        Setting: Fantasy
      </Text>
      <group ref={descriptionGroupRef}>
        <Html
          ref={contentRef}
          portal={{ current: htmlPortal }}
          className="rounded-2xl p-6 sm:p-8 bg-white/90 backdrop-blur transition-opacity duration-300"
          distanceFactor={descriptionScaleFactor}
        >
          <ProjectDescription
            projectName="RPG Story Studio"
            descriptionText="AI-powered RPG campaigns at the push of a button"
            tags={[ReactTag, TypescriptTag, TailwindTag]}
            url="https://rpg-campaign-generator.vercel.app/"
          />
        </Html>
      </group>

      <group ref={d20GroupRef} scale={3} position={[-0.5, 0, 0.5]}>
        <Physics paused={physicsPaused}>
          <group onClick={rollDice}>
            <RigidBody
              position={[0, 0.5, 0]}
              colliders="hull"
              gravityScale={3}
              restitution={0.5}
              ref={d20RigidBodyRef}
            >
              <D20Model color={"gold"} />
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
              <D20Model color="saddlebrown" />
            </RigidBody>
          </group>

          <RigidBody type="fixed" position={[0, -0.66, 0]}>
            <CuboidCollider args={[100, 0.5, 100]}>
              {/* <Plane
                args={[1, 1]}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.66, 0]}
              >
              </Plane> */}
            </CuboidCollider>

            <CuboidCollider
              args={[100, 0.5, 100]}
              position={[0, 0, -0.75]}
              rotation={[Math.PI / 2.25, 0, 0]}
            >
              {/* <Plane args={[1, 1]} rotation={[-Math.PI / 2, 0, 0]}></Plane> */}
            </CuboidCollider>

            <CuboidCollider
              args={[100, 0.5, 100]}
              position={[0, 0, 0.75]}
              rotation={[-Math.PI / 2.25, 0, 0]}
            >
              {/* <Plane args={[1, 1]} rotation={[-Math.PI / 2, 0, 0]}></Plane> */}
            </CuboidCollider>

            <CuboidCollider
              args={[100, 0.5, 100]}
              position={[0.75, 0, 0]}
              rotation={[Math.PI / 2, 0, Math.PI / 2]}
            >
              {/* <Plane args={[1, 1]} rotation={[-Math.PI / 2, 0, 0]}></Plane> */}
            </CuboidCollider>

            <CuboidCollider
              args={[100, 0.5, 100]}
              position={[-0.75, 0, 0]}
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
