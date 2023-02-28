import { Html } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import { useHtmlPortal } from "../useHtmlPortal";
import { PageComponentProps } from "./Pages";
import { useScrollPages } from "./useScrollPages";
import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { RxSquare } from "react-icons/rx";
import { SiItchdotio } from "react-icons/si";

export const ContactPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const htmlPortal = useHtmlPortal();

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    ({ enterAmount, exitAmount, isPageVisible, state }) => {
      if (groupRef.current === null) return;

      groupRef.current.visible = isPageVisible;

      if (contentRef.current === null) return;
      contentRef.current.hidden = !isPageVisible;

      const yPercent = enterAmount + exitAmount;

      const viewportHeight = state.viewport.height;
      groupRef.current.position.setY(yPercent * viewportHeight);
    }
  );

  return (
    <group ref={groupRef}>
      <Html ref={contentRef} fullscreen portal={{ current: htmlPortal }}>
        <div className="h-full flex flex-row portrait:flex-col justify-evenly items-center m-0">
          <a
            href="http://www.github.com/bryndsey"
            className="bg-black p-3 rounded-xl"
          >
            <FaGithub className="w-12 h-12" color="white" />
          </a>
          <a
            href="https://codesandbox.io/u/bryanlindsey"
            className="bg-gray-800 p-3 rounded-xl"
          >
            <RxSquare className="w-12 h-12" color="white" />
          </a>
          <a
            href="https://bryndsey.itch.io/"
            className="bg-red-500 p-3 rounded-xl"
          >
            <SiItchdotio className="w-12 h-12" color="white" />
          </a>
          <a
            href="https://www.linkedin.com/in/bryan-lindsey-1b320998"
            className="bg-blue-600 p-3 rounded-xl"
          >
            <FaLinkedinIn className="w-12 h-12" color="white" />
          </a>
        </div>
      </Html>
    </group>
  );
};
