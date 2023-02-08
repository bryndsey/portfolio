import { useRef } from "react";
import { Group } from "three";
import { PageComponentProps } from "../../Pages";
import { useScrollPages } from "../../useScrollPages";
import { Guitar } from "./Guitar";

export const GuitarPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    (enterAmount, exitAmount, state, delta) => {
      if (groupRef.current === null) return;

      const yPercent = enterAmount + exitAmount;

      const viewportHeight = state.viewport.height;
      groupRef.current.position.setY(yPercent * viewportHeight);
      groupRef.current.position.setX(state.viewport.width / 5);
    }
  );

  return (
    <group ref={groupRef}>
      <group
        // position={[position.x, position.y, position.z]}
        rotation={[Math.PI / 2, -0.25, 0.6]}
      >
        <Guitar />
      </group>
    </group>
  );
};
