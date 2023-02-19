import { animated, useTransition } from "@react-spring/web";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Euler, Group, MathUtils } from "three";
import { ProjectDescription } from "../../ProjectDescription";
import { useHtmlPortal } from "../../useHtmlPortal";
import { useCameraFrustumWidthAtDepth } from "../../utils";
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
    <Html
      center
      style={{
        width: size.width * 0.4,
        // backgroundColor: "rgba(0, 0, 0, 0.2)",
      }}
      position={[viewport.width * 0.25, 0, 0]}
      portal={{ current: htmlPortal }}
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
  );
};

const deviceSize = { width: 0.15, height: 0.3, thickness: 0.02 };
const deviceBezelSize = 64;

const deviceRotation = new Euler();

const deviceZOffset = 1.25;

export const AndroidPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);
  const deviceGroupRef = useRef<Group>(null);

  const [showText, setShowText] = useState(false);

  const [isDeviceOn, setIsDeviceOn] = useState(false);

  const viewport = useThree((state) => state.viewport);
  const isPortrait = viewport.aspect < 1;

  const frustumWidthAtZOffset = useCameraFrustumWidthAtDepth(deviceZOffset);

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    ({ enterAmount, exitAmount, isPageVisible, state }) => {
      const progress = enterAmount + exitAmount;
      if (groupRef.current === null) return;

      groupRef.current.visible = isPageVisible;

      if (isDeviceOn != isPageVisible) {
        setIsDeviceOn(isPageVisible);
      }

      if (!isPageVisible) return;

      if (deviceGroupRef.current === null) return;

      const shouldShowText = progress === 0;
      if (shouldShowText !== showText) {
        setShowText(shouldShowText);
      }

      const targetXPosition = isPortrait ? 0 : -frustumWidthAtZOffset / 6;

      const position = MathUtils.lerp(
        targetXPosition,
        Math.min(-frustumWidthAtZOffset / 2, -1.5),
        Math.abs(progress)
      );
      deviceGroupRef.current.position.setX(position);

      const targetYRotation = isPortrait ? 0 : 0.2;

      const currentRotation = MathUtils.lerp(
        targetYRotation,
        Math.PI * Math.min(state.viewport.width, 2.5),
        Math.abs(progress)
      );

      deviceRotation.set(0, currentRotation, 0);
      deviceGroupRef.current.setRotationFromEuler(deviceRotation);
    }
  );

  return (
    <group ref={groupRef}>
      <group
        ref={deviceGroupRef}
        position={[-10, 0, deviceZOffset]}
        scale={isPortrait ? 3 : 2.5}
      >
        <Device {...deviceSize} bezelSize={deviceBezelSize} isOn={isDeviceOn} />
      </group>
      {/* <FloatingDescription showText={showText} /> */}
      {!isPortrait && <FloatingText showText={showText} />}
    </group>
  );
};
