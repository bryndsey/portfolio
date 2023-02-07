import { Html, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import { contactPageIndex, pageCount } from "./App";

export const ContactPage = () => {
  const size = useThree((state) => state.size);
  const gl = useThree((state) => state.gl);
  const groupRef = useRef<Group>(null);
  const scrollData = useScroll();

  useFrame((state) => {
    if (groupRef.current === null) return;

    const enterAmount =
      scrollData.range(
        (contactPageIndex - 1) / pageCount,
        contactPageIndex / pageCount
      ) - 1;
    const exitAmount = scrollData.range(
      contactPageIndex / pageCount,
      (contactPageIndex + 1) / pageCount
    );

    const yPercent = enterAmount + exitAmount;

    const viewportHeight = state.viewport.height;
    groupRef.current.position.setY(yPercent * viewportHeight);
  });

  return (
    <group ref={groupRef}>
      <Html
        transform
        style={{
          // backgroundColor: "rgba(0, 0, 0, 0.2)",
          width: size.width * 0.5,
          height: size.height * 0.5,
        }}
        portal={{ current: gl.domElement.parentNode }}
        distanceFactor={1}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <a href="http://www.github.com">Github</a>
          <a href="http://www.linkedin.com">LinkedIn</a>
          <p>Something else</p>
        </div>
      </Html>
    </group>
  );
};
