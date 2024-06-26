import { Html } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import { Euler, Group, MathUtils } from "three";
import { useHtmlPortal } from "@hooks/useHtmlPortal";
import { useScreenState } from "@hooks/useScreenState";
import { PageComponentProps } from "@/features/homepage/sections/Pages";
import { useScrollPages } from "@/features/homepage/sections/useScrollPages";
import { useCameraFrustumWidthAtDepth } from "@/components/scene/utils";
import { Device } from "./Device";

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

  const htmlPortal = useHtmlPortal();

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

      const frustumWidthAtZOffset = useCameraFrustumWidthAtDepth(
        state.viewport,
        deviceZOffset
      );
      const targetXPosition = isPortrait ? 0 : -frustumWidthAtZOffset * 0.2;

      const xPosition = MathUtils.lerp(
        targetXPosition,
        Math.min(-frustumWidthAtZOffset / 2, -1.5),
        MathUtils.smoothstep(Math.abs(progress), 0, 1)
      );
      deviceGroupRef.current.position.setX(xPosition);

      const zPosition =
        deviceZOffset -
        (1 - MathUtils.smootherstep(contentProgressAmount, 0, 1)) * 0.1;
      deviceGroupRef.current.position.setZ(zPosition);

      const targetYRotation = isPortrait ? 0 : 0.2;

      const currentRotation = MathUtils.lerp(
        targetYRotation,
        Math.PI * Math.min(state.viewport.width, 2.5),
        MathUtils.smoothstep(Math.abs(progress), 0, 1)
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
            <p className="text-center text-2xl">
              (Tap the icons to learn more)
            </p>
          </Html>
        </group>
      )}
      {/* {!isPortrait && <FloatingText showText={showText} />} */}
    </group>
  );
};
