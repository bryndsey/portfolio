import { useThree } from "@react-three/fiber";

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

  const smallestSize = Math.min(size.width, size.height);
  const deviceClass: DeviceClass =
    smallestSize < smallSize
      ? "small"
      : smallestSize < tabletSize
      ? "tablet"
      : "large";

  const orientation: ScreenOrientation =
    size.width < size.height ? "portrait" : "landscape";

  return { deviceClass: deviceClass, orientation: orientation };
};
