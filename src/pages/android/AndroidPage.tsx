import { animated, useTransition } from "@react-spring/web";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { atom, useAtom } from "jotai";
import { useRef, useState } from "react";
import { Euler, Group, MathUtils } from "three";
import {
  AndroidTag,
  ProjectDescription,
  Tag,
  UnityTag,
} from "../../ProjectDescription";
import { useHtmlPortal } from "../../useHtmlPortal";
import { PageComponentProps } from "../Pages";
import { useScrollPages } from "../useScrollPages";
import { Device } from "./Device";

const deviceSize = { width: 0.15, height: 0.3, thickness: 0.02 };
const deviceBezelSize = 64;

export type AndroidApp = {
  name: string;
  tempIconColor: string;
  description: string;
  projectTags: Tag[];
};

// TODO: Maybe move this into a context/state holder instead of global public variable
export const androidApps: AndroidApp[] = [
  {
    name: "SongSpark",
    tempIconColor: "bg-blue-500",
    description: "The original version of SongSpark, made on Android",
    projectTags: [AndroidTag],
  },
  {
    name: "Tap Band",
    tempIconColor: "bg-red-800",
    description: "Idle clicker game. Get a band together and rise to stardom",
    projectTags: [AndroidTag, UnityTag],
  },
  {
    name: "Tilt Archery Trainer",
    tempIconColor: "bg-green-400",
    description:
      "Practice your aim to take down balloons with your trusty bow and arrow. Putting the AR in ARchery",
    projectTags: [AndroidTag, UnityTag],
  },
  {
    name: "Connected Light App",
    tempIconColor: "bg-teal-600",
    description: "Control smart lights via Bluetooth and Wi-fi",
    projectTags: [AndroidTag],
  },
  {
    name: "Banking App",
    tempIconColor: "bg-blue-400",
    description: "White-label banking application",
    projectTags: [AndroidTag],
  },
  {
    name: "Food Ordering App",
    tempIconColor: "bg-red-600",
    description: "Food ordering from a popular fast food chain",
    projectTags: [AndroidTag],
  },
];

const selectedAppAtom = atom<AndroidApp | null>(null);
export const useSelectedAndroidApp = () => useAtom(selectedAppAtom);

export const AndroidPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);
  const innerGroupRef = useRef<Group>(null);

  const [selectedApp] = useSelectedAndroidApp();
  const selectedAppTransitions = useTransition(selectedApp, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 300 },
    exitBeforeEnter: true,
  });

  const [showText, setShowText] = useState(false);
  const showTextTransitions = useTransition(showText, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 300 },
  });

  const htmlPortal = useHtmlPortal();

  const size = useThree((state) => state.size);
  const viewport = useThree((state) => state.viewport);

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    (enterAmount, exitAmount, state) => {
      if (groupRef.current === null) return;

      const progress = enterAmount + exitAmount;

      const shouldShowText = progress === 0;
      if (shouldShowText !== showText) {
        setShowText(shouldShowText);
      }

      const position = MathUtils.lerp(
        -state.viewport.width / 6,
        -state.viewport.width,
        Math.abs(progress)
      );
      groupRef.current.position.setX(position);

      const currentRotation = MathUtils.lerp(
        0.2,
        Math.PI * 2,
        Math.abs(progress)
      );

      if (innerGroupRef.current === null) return;

      innerGroupRef.current.setRotationFromEuler(
        new Euler(0, currentRotation, 0)
      );
    }
  );

  return (
    <group>
      <group ref={groupRef}>
        <group ref={innerGroupRef} scale={4}>
          <Device {...deviceSize} bezelSize={deviceBezelSize} />
        </group>
      </group>
      <group>
        <Html
          transform
          style={{
            width: size.width / 3,
            // backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
          position={[viewport.width / 4, viewport.height / 5, 0]}
          portal={{ current: htmlPortal }}
          distanceFactor={1}
        >
          {showTextTransitions(
            (showStyle, show) =>
              show && (
                <animated.div style={showStyle}>
                  {selectedAppTransitions((style, app) => (
                    <animated.div style={style}>
                      {app ? (
                        <ProjectDescription
                          projectName={app.name}
                          descriptionText={app.description}
                          tags={app.projectTags}
                        />
                      ) : (
                        <div className="text-center text-2xl">
                          Select an app to learn more
                        </div>
                      )}
                    </animated.div>
                  ))}
                </animated.div>
              )
          )}
        </Html>
      </group>
    </group>
  );
};
