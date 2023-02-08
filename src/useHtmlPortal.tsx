import { useScroll } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export function useHtmlPortal(): HTMLElement {
  const scrollData = useScroll();
  const gl = useThree((state) => state.gl);

  if (scrollData === null) {
    const canvasParent = gl.domElement.parentElement;
    if (canvasParent === null) {
      throw new Error("Unable to retrieve suitable portal for HTML content");
    }
    return canvasParent;
  }

  return scrollData.fixed;
}
