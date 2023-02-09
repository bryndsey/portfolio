import { useRef } from "react";
import { Euler, Group, MathUtils } from "three";
import { AndroidTag, Tag, UnityTag } from "../../ProjectDescription";
import { PageComponentProps } from "../Pages";
import { useScrollPages } from "../useScrollPages";
import { Device } from "./Device";

const deviceSize = { width: 0.15, height: 0.3, thickness: 0.02 };
const deviceBezelSize = 64;

export type AndroidApp = {
  name: string;
  tempIconColor: string;
  description: string;
  projectTags: Tag[];
};

// TODO: Maybe move this into a context/state holder instead of global public variable
export const androidApps: AndroidApp[] = [
  {
    name: "SongSpark",
    tempIconColor: "bg-blue-500",
    description: "The original version of SongSpark, made on Android",
    projectTags: [AndroidTag],
  },
  {
    name: "Tap Band",
    tempIconColor: "bg-red-800",
    description: "Idle clicker game. Get a band together and rise to stardom",
    projectTags: [AndroidTag, UnityTag],
  },
  {
    name: "Tilt Archery Trainer",
    tempIconColor: "bg-green-400",
    description:
      "Practice your aim to take down balloons with your trusty bow and arrow. Putting the AR in ARchery",
    projectTags: [AndroidTag, UnityTag],
  },
  {
    name: "Connected Light App",
    tempIconColor: "bg-teal-600",
    description: "Control smart lights via Bluetooth and Wi-fi",
    projectTags: [AndroidTag],
  },
  {
    name: "Banking App",
    tempIconColor: "bg-blue-400",
    description: "White-label banking application",
    projectTags: [AndroidTag],
  },
  {
    name: "Food Ordering App",
    tempIconColor: "bg-red-600",
    description: "Food ordering from a popular fast food chain",
    projectTags: [AndroidTag],
  },
];

export const AndroidPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);
  const innerGroupRef = useRef<Group>(null);

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    (enterAmount, exitAmount, state) => {
      if (groupRef.current === null) return;

      const progress = enterAmount + exitAmount;

      const position = MathUtils.lerp(
        -state.viewport.width / 6,
        -state.viewport.width,
        Math.abs(progress)
      );
      groupRef.current.position.setX(position);

      const currentRotation = MathUtils.lerp(
        0.2,
        Math.PI * 2,
        Math.abs(progress)
      );

      if (innerGroupRef.current === null) return;

      innerGroupRef.current.setRotationFromEuler(
        new Euler(0, currentRotation, 0)
      );
    }
  );

  return (
    <group ref={groupRef}>
      <group ref={innerGroupRef} scale={4}>
        <Device {...deviceSize} bezelSize={deviceBezelSize} />
      </group>
    </group>
  );
};
