import { useThree } from "@react-three/fiber";

export function useHtmlPortal(): HTMLElement {
  const gl = useThree((state) => state.gl);
  const canvasParent = gl.domElement.parentElement;

  const explicitPortal = document.getElementById("htmlPortal");
  if (explicitPortal !== null) {
    return explicitPortal;
  }
  if (canvasParent === null) {
    throw new Error("Unable to retrieve suitable portal for HTML content");
  }
  return canvasParent;
}
