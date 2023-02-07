import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";

export const IntroText = () => {
  const size = useThree((state) => state.size);

  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const mouse = state.mouse;
    if (groupRef.current === null) return;
    groupRef.current.lookAt(mouse.x, mouse.y, 10);
  });

  return (
    <group ref={groupRef}>
      <Html
        transform
        position={[0, 0, 0]}
        distanceFactor={1}
        style={{
          // backgroundColor: "rgba(0, 0, 1, 0.1)",
          width: size.width * 0.66,
          height: size.height * 0.66,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: 60,
              fontWeight: "bolder",
            }}
          >
            Hi. My name is <br />
            <span style={{ fontSize: 100 }}>Bryan Lindsey</span>
          </p>
        </div>
      </Html>
    </group>
  );
};
