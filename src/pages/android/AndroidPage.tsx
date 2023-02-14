import { animated, useTransition } from "@react-spring/web";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Euler, Group, MathUtils } from "three";
import { ProjectDescription } from "../../ProjectDescription";
import { useHtmlPortal } from "../../useHtmlPortal";
import { PageComponentProps } from "../Pages";
import { useScrollPages } from "../useScrollPages";
import { Device } from "./Device";
import { useSelectedAndroidApp } from "./useSelectedAndroidApp";

const deviceSize = { width: 0.15, height: 0.3, thickness: 0.02 };
const deviceBezelSize = 64;

const deviceRotation = new Euler();

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
    ({ enterAmount, exitAmount, state }) => {
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
        Math.PI * 3,
        Math.abs(progress)
      );

      if (innerGroupRef.current === null) return;

      deviceRotation.set(0, currentRotation, 0);
      innerGroupRef.current.setRotationFromEuler(deviceRotation);
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
