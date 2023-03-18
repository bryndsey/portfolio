import { animated, useTransition } from "@react-spring/web";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { stat } from "fs";
import { Suspense, useRef, useState } from "react";
import { Euler, Group, MathUtils } from "three";
import { useHtmlPortal } from "../../useHtmlPortal";
import { useScreenState } from "../../useScreenState";
import { useCameraFrustumWidthAtDepth } from "../../utils";
import { PageComponentProps } from "../Pages";
import { useScrollPages } from "../useScrollPages";
import { Device } from "./Device";

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

  const screenState = useScreenState();
  const descriptionScaleFactor =
    screenState.deviceClass === "small" &&
    screenState.orientation === "landscape"
      ? 1.5
      : 2;

  return (
    <Html
      center
      style={{
        width: size.width * 0.5,
        // backgroundColor: "rgba(0, 0, 0, 0.2)",
      }}
      position={[viewport.width * 0.225, 0, 0]}
      portal={{ current: htmlPortal }}
      distanceFactor={descriptionScaleFactor}
    >
      {showTextTransitions(
        (showStyle, show) =>
          show && (
            <animated.div style={showStyle}>
              <p className="text-center text-7xl lg:text-8xl font-semibold mb-6">
                Android Projects
              </p>
              <p className="text-center text-2xl font-handwritten font-bold">
                (Tap the icons to learn more)
              </p>
            </animated.div>
          )
      )}
    </Html>
  );
};

const deviceRotation = new Euler();

const deviceZOffset = 1.25;

export const AndroidPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null!);
  const deviceGroupRef = useRef<Group>(null);

  const labelText = useRef<HTMLDivElement>(null);
  const labelTextGroup = useRef<Group>(null);

  const [showText, setShowText] = useState(false);

  const [isDeviceOn, setIsDeviceOn] = useState(false);

  const screenState = useScreenState();
  const isPortrait = screenState.orientation === "portrait";

  const frustumWidthAtZOffset = useCameraFrustumWidthAtDepth(deviceZOffset);

  const htmlPortal = useHtmlPortal();

  const viewport = useThree((state) => state.viewport);

  const descriptionScaleFactor =
    screenState.deviceClass === "small" &&
    screenState.orientation === "landscape"
      ? 1.5
      : 2;

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
      const progress = enterAmount + exitAmount;

      groupRef.current.visible = isPageVisible;

      const isOnPageContent =
        isPageVisible && contentProgressAmount > 0 && contentProgressAmount < 1;
      if (isOnPageContent != isDeviceOn) {
        setIsDeviceOn(isOnPageContent);
      }

      if (labelText.current !== null) {
        labelText.current.style.width = `${state.size.width * 0.5}`;
        labelText.current.hidden = !isOnPageContent;
      }

      if (labelTextGroup.current !== null) {
        labelTextGroup.current.position.setX(state.viewport.width * 0.225);
        labelTextGroup.current.visible = isPageVisible;
        labelTextGroup.current.position.setY(
          MathUtils.lerp(
            -state.viewport.height,
            state.viewport.height,
            contentProgressAmount
          )
        );
      }

      if (!isPageVisible) return;

      if (deviceGroupRef.current === null) return;

      const shouldShowText = progress === 0;
      if (shouldShowText !== showText) {
        setShowText(shouldShowText);
      }

      const targetXPosition = isPortrait ? 0 : -frustumWidthAtZOffset * 0.2;

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
      <Suspense fallback={null}>
        <group ref={deviceGroupRef} position={[-10, 0, deviceZOffset]}>
          <Device isOn={isDeviceOn} />
        </group>
      </Suspense>
      {!isPortrait && (
        <group ref={labelTextGroup}>
          <Html
            ref={labelText}
            center
            portal={{ current: htmlPortal }}
            distanceFactor={descriptionScaleFactor}
          >
            <p className="text-center text-7xl lg:text-8xl font-semibold mb-6">
              Android Projects
            </p>
            <p className="text-center text-2xl font-handwritten font-bold">
              (Tap the icons to learn more)
            </p>
          </Html>
        </group>
      )}
      {/* {!isPortrait && <FloatingText showText={showText} />} */}
    </group>
  );
};
