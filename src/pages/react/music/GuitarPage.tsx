import { useRef } from "react";
import { types, useControls } from "theatric";
import { Group } from "three";
import { Guitar } from "./Guitar";
import { PageComponentProps } from "../../Pages";
import { useScrollPages } from "../../useScrollPages";

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
    }
  );

  return (
    <group ref={groupRef}>
      <GuitarContainer />
    </group>
  );
};

const GuitarContainer = () => {
  const { position, rotation } = useControls(
    {
      position: {
        x: types.number(0.2, { nudgeMultiplier: 0.1 }),
        y: types.number(0, { nudgeMultiplier: 0.1 }),
        z: types.number(0, { nudgeMultiplier: 0.1 }),
      },
      rotation: {
        x: types.number(Math.PI / 2, { range: [-Math.PI, Math.PI] }),
        y: types.number(-0.25, { range: [-Math.PI, Math.PI] }),
        z: types.number(0.6, { range: [-Math.PI, Math.PI] }),
      },
    },
    { folder: "guitar" }
  );
  return (
    <group
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
    >
      <Guitar />
    </group>
  );
};
