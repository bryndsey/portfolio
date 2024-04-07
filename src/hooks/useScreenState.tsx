import { useThree } from "@react-three/fiber";

const smallSize = 640;
const tabletSize = 768;

const deviceClasses = ["small", "tablet", "large"] as const;
type DeviceClass = (typeof deviceClasses)[number];

const screenOrientations = ["landscape", "portrait"] as const;
type ScreenOrientation = (typeof screenOrientations)[number];

export interface ScreenState {
  deviceClass: DeviceClass;
  orientation: ScreenOrientation;
}

export const useScreenState = (): ScreenState => {
  const screenState = useThree(
    (state) => {
      const size = state.size;
      const smallestSize = Math.min(size.width, size.height);
      const deviceClass: DeviceClass =
        smallestSize < smallSize
          ? "small"
          : smallestSize < tabletSize
          ? "tablet"
          : "large";

      const orientation: ScreenOrientation =
        size.width <= size.height ? "portrait" : "landscape";

      return {
        deviceClass: deviceClass,
        orientation: orientation,
      } as ScreenState;
    },
    (state, newState) => {
      return (
        newState.deviceClass === state.deviceClass &&
        newState.orientation === state.orientation
      );
    }
  );

  return screenState;
};
