import { useThree } from "@react-three/fiber";

// NOTE: This function makes a lot of assumptions about the angle and position
// of the camera, and will probably break if the camera is moved or angled much

export function useCameraFrustumWidthAtDepth(
  viewport: { width: number; distance: number },
  depth: number
): number {
  const slope = -viewport.width / viewport.distance;
  const offset = viewport.width;
  const xOffset = slope * depth + offset;

  return xOffset;
}
