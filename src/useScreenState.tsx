import { useThree } from "@react-three/fiber";
import { useMemo, useState } from "react";

const smallSize = 640;
const tabletSize = 768;

type DeviceClass = "small" | "tablet" | "large";
type ScreenOrientation = "landscape" | "portrait";

interface ScreenState {
  deviceClass: DeviceClass;
  orientation: ScreenOrientation;
}

export const useScreenState = (): ScreenState => {
  const size = useThree((state) => state.size);

  const [currentClass, setCurrentClass] = useState<DeviceClass>("small");
  const [currentOrientation, setCurrentOrientation] =
    useState<ScreenOrientation>("landscape");

  const currentState = useMemo(
    () => ({
      deviceClass: currentClass,
      orientation: currentOrientation,
    }),
    [currentClass, currentOrientation]
  );

  const smallestSize = Math.min(size.width, size.height);
  const deviceClass: DeviceClass =
    smallestSize < smallSize
      ? "small"
      : smallestSize < tabletSize
      ? "tablet"
      : "large";

  if (currentClass !== deviceClass) {
    setCurrentClass(deviceClass);
  }

  const orientation: ScreenOrientation =
    size.width <= size.height ? "portrait" : "landscape";

  if (currentOrientation !== orientation) {
    setCurrentOrientation(orientation);
  }

  return currentState;
};
