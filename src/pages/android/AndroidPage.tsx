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

interface FloatingDescriptionProps {
  showText: boolean;
}

const FloatingDescription = (props: FloatingDescriptionProps) => {
  const { showText } = props;
  const [selectedApp] = useSelectedAndroidApp();
  const selectedAppTransitions = useTransition(selectedApp, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 300 },
    exitBeforeEnter: true,
  });

  const showTextTransitions = useTransition(showText, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 300 },
  });

  const htmlPortal = useHtmlPortal();

  const size = useThree((state) => state.size);
  const viewport = useThree((state) => state.viewport);

  return (
    <group>
      <Html
        transform
        style={{
          width: size.width * 0.4,
          // backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
        position={[viewport.width / 4, viewport.height / 6, 0]}
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
                        url={app.url}
                        actionText={"Play Store"}
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
  );
};

interface FloatingTextProps {
  showText: boolean;
}

const FloatingText = (props: FloatingTextProps) => {
  const { showText } = props;

  const showTextTransitions = useTransition(showText, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 300 },
  });

  const htmlPortal = useHtmlPortal();

  const size = useThree((state) => state.size);
  const viewport = useThree((state) => state.viewport);

  return (
    <group>
      <Html
        transform
        style={{
          width: size.width * 0.4,
          // backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
        position={[viewport.width * 0.25, 0, 0]}
        portal={{ current: htmlPortal }}
        distanceFactor={1}
      >
        {showTextTransitions(
          (showStyle, show) =>
            show && (
              <animated.div style={showStyle}>
                <p className="text-center text-8xl font-semibold mb-6">
                  Android Projects
                </p>
                <p className="text-center text-2xl">
                  (Tap the screen to learn more)
                </p>
              </animated.div>
            )
        )}
      </Html>
    </group>
  );
};

const deviceSize = { width: 0.15, height: 0.3, thickness: 0.02 };
const deviceBezelSize = 64;

const deviceRotation = new Euler();

export const AndroidPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);
  const innerGroupRef = useRef<Group>(null);

  const [showText, setShowText] = useState(false);

  const viewport = useThree((state) => state.viewport);
  const isPortrait = viewport.aspect < 1;

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

      const targetXPosition = isPortrait ? 0 : -state.viewport.width / 6;

      const position = MathUtils.lerp(
        targetXPosition,
        -state.viewport.width,
        Math.abs(progress)
      );
      groupRef.current.position.setX(position);

      const targetYRotation = isPortrait ? 0 : 0.2;

      const currentRotation = MathUtils.lerp(
        targetYRotation,
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
        <group ref={innerGroupRef} scale={isPortrait ? 6 : 5.5}>
          <Device {...deviceSize} bezelSize={deviceBezelSize} />
        </group>
      </group>
      {/* <FloatingDescription showText={showText} /> */}
      {!isPortrait && <FloatingText showText={showText} />}
    </group>
  );
};
