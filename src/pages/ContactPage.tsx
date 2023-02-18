import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import { useHtmlPortal } from "../useHtmlPortal";
import { PageComponentProps } from "./Pages";
import { useScrollPages } from "./useScrollPages";
import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";

export const ContactPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);

  const htmlPortal = useHtmlPortal();

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    ({ enterAmount, exitAmount, state }) => {
      if (groupRef.current === null) return;

      const yPercent = enterAmount + exitAmount;

      const viewportHeight = state.viewport.height;
      groupRef.current.position.setY(yPercent * viewportHeight);
    }
  );

  return (
    <group ref={groupRef}>
      <Html fullscreen portal={{ current: htmlPortal }}>
        <div className="h-full flex flex-row portrait:flex-col justify-evenly items-center m-0">
          <a
            href="http://www.github.com/bryndsey"
            className="bg-black p-3 rounded-xl"
          >
            <FaGithub className="w-12 h-12" color="white" />
          </a>
          <a
            href="https://www.linkedin.com/in/bryan-lindsey-1b320998"
            className="bg-blue-600 p-3 rounded-xl"
          >
            <FaLinkedinIn className="w-12 h-12" color="white" />
          </a>
          <a
            href="mailto:contact@bryanlindsey.dev"
            className="bg-yellow-400 p-3 rounded-xl"
          >
            <MdAlternateEmail className="w-12 h-12" color="white" />
          </a>
        </div>
      </Html>
    </group>
  );
};
