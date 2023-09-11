import { useThree } from "@react-three/fiber";

export function useHtmlPortal(): HTMLElement {
  const gl = useThree((state) => state.gl);
  const canvasParent = gl.domElement.parentElement;
  if (canvasParent === null) {
    throw new Error("Unable to retrieve suitable portal for HTML content");
  }
  return canvasParent;
}
